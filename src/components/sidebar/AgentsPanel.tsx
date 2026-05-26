// @ts-nocheck
import { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import * as d3 from 'd3'
import { useHermesStore } from '../../store/hermes'
import type { Agent } from '../../store/types'

interface SimNode extends d3.SimulationNodeDatum {
  id: string
  name: string
  role: string
  status: string
  tasksActive: number
  tasksCompleted: number
  radius: number
}

interface SimLink extends d3.SimulationLinkDatum<SimNode> {
  source: string | SimNode
  target: string | SimNode
}

export default function AgentsPanel() {
  const agents = useHermesStore((s) => s.agents)
  const svgRef = useRef<SVGSVGElement>(null)
  const [hoveredAgent, setHoveredAgent] = useState<Agent | null>(null)

  const { nodes, links } = useMemo(() => {
    const ns: SimNode[] = agents.map((a) => ({
      id: a.id,
      name: a.name,
      role: a.role,
      status: a.status,
      tasksActive: a.tasksActive,
      tasksCompleted: a.tasksCompleted,
      radius: 20 + a.tasksActive * 4,
    }))
    const ls: SimLink[] = []
    agents.forEach((a) => {
      a.connections.forEach((cid) => {
        if (agents.find((x) => x.id === cid)) {
          ls.push({ source: a.id, target: cid })
        }
      })
    })
    return { nodes: ns, links: ls }
  }, [agents])

  const getStatusColor = useCallback((status: string) => {
    switch (status) {
      case 'active': return '#00d4ff'
      case 'working': return '#22d3ee'
      case 'error': return '#ff2d55'
      default: return '#555'
    }
  }, [])

  useEffect(() => {
    if (!svgRef.current || nodes.length === 0) return

    const svg = d3.select(svgRef.current)
    const width = svgRef.current.clientWidth || 260
    const height = 300

    svg.selectAll('*').remove()

    const g = svg.append('g')

    const simulation = d3
      .forceSimulation<SimNode>(nodes)
      .force('link', d3.forceLink<SimNode, SimLink>(links).id((d) => d.id).distance(80))
      .force('charge', d3.forceManyBody().strength(-200))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide<SimNode>().radius((d) => d.radius + 10))

    const link = g
      .append('g')
      .selectAll('line')
      .data(links)
      .join('line')
      .attr('stroke', '#00d4ff')
      .attr('stroke-opacity', 0.2)
      .attr('stroke-width', 1)

    const node = g
      .append('g')
      .selectAll<SVGGElement, SimNode>('g')
      .data(nodes)
      .join('g')
      .style('cursor', 'pointer')
      .call(
        d3
          .drag<SVGGElement, SimNode>()
          .on('start', (event, d) => {
            if (!event.active) simulation.alphaTarget(0.3).restart()
            d.fx = d.x
            d.fy = d.y
          })
          .on('drag', (event, d) => {
            d.fx = event.x
            d.fy = event.y
          })
          .on('end', (event, d) => {
            if (!event.active) simulation.alphaTarget(0)
            d.fx = null
            d.fy = null
          }),
      )

    // Glow filter
    const defs = svg.append('defs')
    const filter = defs.append('filter').attr('id', 'glow')
    filter.append('feGaussianBlur').attr('stdDeviation', '3').attr('result', 'coloredBlur')
    const feMerge = filter.append('feMerge')
    feMerge.append('feMergeNode').attr('in', 'coloredBlur')
    feMerge.append('feMergeNode').attr('in', 'SourceGraphic')

    node
      .append('circle')
      .attr('r', (d) => d.radius)
      .attr('fill', (d) => `${getStatusColor(d.status)}15`)
      .attr('stroke', (d) => getStatusColor(d.status))
      .attr('stroke-width', 1.5)
      .attr('filter', 'url(#glow)')

    // Pulsing ring for active agents
    node
      .filter((d) => d.status === 'active' || d.status === 'working')
      .append('circle')
      .attr('r', (d) => d.radius + 5)
      .attr('fill', 'none')
      .attr('stroke', (d) => getStatusColor(d.status))
      .attr('stroke-width', 0.5)
      .attr('opacity', 0.4)
      .append('animate')
      .attr('attributeName', 'r', )
      .attr('values', (d) => `${d.radius + 5};${d.radius + 15};${d.radius + 5}`)
      .attr('dur', '2s')
      .attr('repeatCount', 'indefinite')

    node
      .append('text')
      .text((d) => d.name)
      .attr('text-anchor', 'middle')
      .attr('dy', '-0.2em')
      .attr('fill', '#f0f0ff')
      .attr('font-size', '10px')
      .attr('font-family', 'Share Tech Mono, monospace')
      .attr('font-weight', '600')

    node
      .append('text')
      .text((d) => `${d.tasksActive} active`)
      .attr('text-anchor', 'middle')
      .attr('dy', '1em')
      .attr('fill', (d) => getStatusColor(d.status))
      .attr('font-size', '8px')
      .attr('font-family', 'Share Tech Mono, monospace')

    node
      .on('mouseenter', (_, d) => {
        const agent = agents.find((a) => a.id === d.id)
        if (agent) setHoveredAgent(agent)
      })
      .on('mouseleave', () => setHoveredAgent(null))

    simulation.on('tick', () => {
      link
        .attr('x1', (d) => (d.source as SimNode).x ?? 0)
        .attr('y1', (d) => (d.source as SimNode).y ?? 0)
        .attr('x2', (d) => (d.target as SimNode).x ?? 0)
        .attr('y2', (d) => (d.target as SimNode).y ?? 0)

      node.attr('transform', (d) => `translate(${d.x ?? 0},${d.y ?? 0})`)
    })

    return () => {
      simulation.stop()
    }
  }, [nodes, links, agents, getStatusColor])

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-3 py-2 border-b border-white/5">
        <h3 className="text-xs font-mono tracking-wider text-[#00d4ff]">AGENT NETWORK</h3>
        <span className="text-[10px] font-mono text-white/30">
          {agents.filter((a) => a.status === 'active' || a.status === 'working').length}/{agents.length} online
        </span>
      </div>

      <div className="flex-1 relative">
        <svg ref={svgRef} className="w-full h-full" viewBox="0 0 260 300" />

        {/* Hover tooltip */}
        {hoveredAgent && (
          <div className="absolute bottom-2 left-2 right-2 bg-black/80 border border-white/10 rounded-lg p-2 backdrop-blur-sm">
            <div className="flex items-center gap-2 mb-1">
              <div
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: getStatusColor(hoveredAgent.status), boxShadow: `0 0 6px ${getStatusColor(hoveredAgent.status)}` }}
              />
              <span className="text-xs font-mono text-[#f0f0ff]">{hoveredAgent.name}</span>
            </div>
            <p className="text-[10px] font-mono text-white/50">{hoveredAgent.role}</p>
            <div className="flex gap-3 mt-1">
              <span className="text-[10px] font-mono text-[#00d4ff]">{hoveredAgent.tasksActive} active</span>
              <span className="text-[10px] font-mono text-white/30">{hoveredAgent.tasksCompleted} done</span>
            </div>
          </div>
        )}
      </div>

      {/* Agent list */}
      <div className="border-t border-white/5 px-2 py-1 space-y-0.5">
        {agents.map((agent) => (
          <div
            key={agent.id}
            className="flex items-center gap-2 px-2 py-1 rounded hover:bg-white/5 transition-colors cursor-pointer"
            onMouseEnter={() => setHoveredAgent(agent)}
            onMouseLeave={() => setHoveredAgent(null)}
          >
            <div
              className="w-1.5 h-1.5 rounded-full shrink-0"
              style={{ backgroundColor: getStatusColor(agent.status), boxShadow: `0 0 4px ${getStatusColor(agent.status)}` }}
            />
            <span className="text-[10px] font-mono text-white/70 flex-1 truncate">{agent.name}</span>
            <span className="text-[9px] font-mono" style={{ color: getStatusColor(agent.status) }}>
              {agent.tasksActive > 0 ? `${agent.tasksActive} tasks` : agent.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
