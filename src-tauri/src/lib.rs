use serde::{Deserialize, Serialize};
use std::process::Command;
use tauri::command;

// ============================================
// Data structures
// ============================================

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct OllamaModel {
    pub name: String,
    pub size: u64,
    pub digest: String,
    pub modified_at: String,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct ConnectionTestResult {
    pub success: bool,
    pub message: String,
    pub models: Option<Vec<OllamaModel>>,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct PullResult {
    pub success: bool,
    pub message: String,
}

// ============================================
// Tauri Commands
// ============================================

/// Check if Ollama is installed on the system
#[command]
fn check_ollama_installed() -> Result<bool, String> {
    let output = Command::new("ollama")
        .arg("--version")
        .output()
        .map_err(|e| format!("Failed to check Ollama: {}", e))?;

    Ok(output.status.success())
}

/// Get Ollama version
#[command]
fn get_ollama_version() -> Result<String, String> {
    let output = Command::new("ollama")
        .arg("--version")
        .output()
        .map_err(|e| format!("Failed to get Ollama version: {}", e))?;

    let version = String::from_utf8_lossy(&output.stdout).trim().to_string();
    Ok(version)
}

/// Install Ollama on Windows (downloads the installer)
#[command]
fn install_ollama() -> Result<PullResult, String> {
    // Download Ollama for Windows
    let _download = Command::new("powershell")
        .args([
            "-Command",
            "Invoke-WebRequest -Uri 'https://ollama.com/download/OllamaSetup.exe' -OutFile \"$env:TEMP\\OllamaSetup.exe\" -UseBasicParsing"
        ])
        .output()
        .map_err(|e| format!("Failed to download Ollama: {}", e))?;

    // Run the installer silently
    let install = Command::new("powershell")
        .args([
            "-Command",
            "Start-Process \"$env:TEMP\\OllamaSetup.exe\" -ArgumentList '/S' -Wait"
        ])
        .output()
        .map_err(|e| format!("Failed to install Ollama: {}", e))?;

    if install.status.success() {
        Ok(PullResult {
            success: true,
            message: "Ollama installed successfully. Please restart the app.".to_string(),
        })
    } else {
        let err = String::from_utf8_lossy(&install.stderr);
        Ok(PullResult {
            success: false,
            message: format!("Installation failed: {}", err),
        })
    }
}

/// List locally installed Ollama models
#[command]
fn list_ollama_models() -> Result<Vec<OllamaModel>, String> {
    let output = Command::new("ollama")
        .arg("list")
        .output()
        .map_err(|e| format!("Failed to list models: {}", e))?;

    let stdout = String::from_utf8_lossy(&output.stdout);
    let mut models = Vec::new();

    for line in stdout.lines().skip(1) {
        // Skip header line
        let parts: Vec<&str> = line.split_whitespace().collect();
        if parts.len() >= 2 {
            models.push(OllamaModel {
                name: parts[0].to_string(),
                size: 0,
                digest: String::new(),
                modified_at: String::new(),
            });
        }
    }

    Ok(models)
}

/// Pull (download) an Ollama model
#[command]
fn pull_ollama_model(model_name: String) -> Result<PullResult, String> {
    let output = Command::new("ollama")
        .args(["pull", &model_name])
        .output()
        .map_err(|e| format!("Failed to pull model: {}", e))?;

    if output.status.success() {
        Ok(PullResult {
            success: true,
            message: format!("Model '{}' installed successfully.", model_name),
        })
    } else {
        let err = String::from_utf8_lossy(&output.stderr);
        Ok(PullResult {
            success: false,
            message: format!("Pull failed: {}", err),
        })
    }
}

/// Remove an Ollama model
#[command]
fn remove_ollama_model(model_name: String) -> Result<PullResult, String> {
    let output = Command::new("ollama")
        .args(["rm", &model_name])
        .output()
        .map_err(|e| format!("Failed to remove model: {}", e))?;

    if output.status.success() {
        Ok(PullResult {
            success: true,
            message: format!("Model '{}' removed.", model_name),
        })
    } else {
        let err = String::from_utf8_lossy(&output.stderr);
        Ok(PullResult {
            success: false,
            message: format!("Remove failed: {}", err),
        })
    }
}

/// Test connection to a URL (Ollama or Hermes Docker)
#[command]
fn test_connection(url: String) -> Result<ConnectionTestResult, String> {
    let client = reqwest::blocking::Client::builder()
        .timeout(std::time::Duration::from_secs(5))
        .build()
        .map_err(|e| format!("HTTP client error: {}", e))?;

    // Try /api/tags first (Ollama), then /models (OpenAI-compatible)
    let tags_url = format!("{}/api/tags", url.trim_end_matches('/'));
    match client.get(&tags_url).send() {
        Ok(resp) if resp.status().is_success() => {
            let body = resp.text().unwrap_or_default();
            let models: Vec<OllamaModel> = serde_json::from_str(&body)
                .unwrap_or_default();
            Ok(ConnectionTestResult {
                success: true,
                message: "Connected successfully!".to_string(),
                models: Some(models),
            })
        }
        _ => {
            // Try OpenAI-compatible endpoint
            let models_url = format!("{}/models", url.trim_end_matches('/'));
            match client.get(&models_url).send() {
                Ok(resp) if resp.status().is_success() => Ok(ConnectionTestResult {
                    success: true,
                    message: "Connected (OpenAI-compatible endpoint).".to_string(),
                    models: None,
                }),
                Ok(resp) => Ok(ConnectionTestResult {
                    success: false,
                    message: format!("Server responded with status: {}", resp.status()),
                    models: None,
                }),
                Err(e) => Ok(ConnectionTestResult {
                    success: false,
                    message: format!("Connection failed: {}", e),
                    models: None,
                }),
            }
        }
    }
}

/// Check if Docker is running
#[command]
fn check_docker_running() -> Result<bool, String> {
    let output = Command::new("docker")
        .args(["ps"])
        .output()
        .map_err(|e| format!("Docker not found: {}", e))?;

    Ok(output.status.success())
}

/// List Docker containers (to find Hermes)
#[command]
fn list_docker_containers() -> Result<Vec<String>, String> {
    let output = Command::new("docker")
        .args(["ps", "--format", "{{.Names}}"])
        .output()
        .map_err(|e| format!("Failed to list containers: {}", e))?;

    let stdout = String::from_utf8_lossy(&output.stdout);
    let containers: Vec<String> = stdout
        .lines()
        .map(|s| s.trim().to_string())
        .filter(|s| !s.is_empty())
        .collect();

    Ok(containers)
}

/// Start Hermes Docker container
#[command]
fn start_hermes_container(
    container_name: String,
    port: u16,
    api_key: String,
) -> Result<PullResult, String> {
    let port_mapping = format!("{}:11434", port);
    let mut args = vec![
        "run", "-d",
        "--name", &container_name,
        "-p", &port_mapping,
        "-v", "ollama:/root/.ollama",
        "--restart", "unless-stopped",
        "ollama/ollama:latest",
    ];

    let mut cmd = Command::new("docker");
    cmd.args(&args);

    if !api_key.is_empty() {
        cmd.env("OLLAMA_API_KEY", &api_key);
    }

    let output = cmd.output().map_err(|e| format!("Failed to start container: {}", e))?;

    if output.status.success() {
        Ok(PullResult {
            success: true,
            message: format!(
                "Hermes container '{}' started on port {}.",
                container_name, port
            ),
        })
    } else {
        let err = String::from_utf8_lossy(&output.stderr);
        Ok(PullResult {
            success: false,
            message: format!("Failed to start: {}", err),
        })
    }
}

// ============================================
// Main entry
// ============================================

pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .invoke_handler(tauri::generate_handler![
            check_ollama_installed,
            get_ollama_version,
            install_ollama,
            list_ollama_models,
            pull_ollama_model,
            remove_ollama_model,
            test_connection,
            check_docker_running,
            list_docker_containers,
            start_hermes_container,
        ])
        .run(tauri::generate_context!())
        .expect("error while running Hermes");
}
