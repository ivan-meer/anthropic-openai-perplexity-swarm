from typing import Dict, List, Optional
from ..agents.interfaces import IAgent
from ..agents.factory import AgentFactory

class SwarmEngine:
    """Core engine for managing agents"""
    
    def __init__(self):
        self._agents: Dict[str, IAgent] = {}
        
    def create_agent(self, agent_type: str) -> IAgent:
        """Create and register new agent"""
        agent = AgentFactory.create_agent(agent_type)
        self._agents[agent.name] = agent
        return agent
        
    def get_agent(self, name: str) -> Optional[IAgent]:
        """Get agent by name"""
        return self._agents.get(name)
        
    def list_agents(self) -> List[IAgent]:
        """Get list of all registered agents"""
        return list(self._agents.values())
        
    def remove_agent(self, name: str) -> None:
        """Remove agent by name"""
        if name in self._agents:
            agent = self._agents[name]
            agent.stop()
            del self._agents[name]
            
    def run_task(self, agent_name: str, task: Dict) -> Dict:
        """Run task on specified agent"""
        agent = self.get_agent(agent_name)
        if not agent:
            raise ValueError(f"Agent not found: {agent_name}")
            
        return agent.run(task)
        
    def get_agent_status(self, agent_name: str) -> Dict:
        """Get status of specified agent"""
        agent = self.get_agent(agent_name)
        if not agent:
            raise ValueError(f"Agent not found: {agent_name}")
            
        return agent.get_status()
        
    def stop_agent(self, agent_name: str) -> None:
        """Stop specified agent"""
        agent = self.get_agent(agent_name)
        if not agent:
            raise ValueError(f"Agent not found: {agent_name}")
            
        agent.stop()
