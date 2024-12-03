from typing import Dict, Type
from .interfaces import IAgent
from .base_agent import BaseAgent
from .content_creator import ContentCreator

class AgentFactory:
    """Factory for creating agents"""
    
    _agent_types: Dict[str, Type[BaseAgent]] = {
        "content_creator": ContentCreator
    }
    
    @classmethod
    def register_agent_type(cls, name: str, agent_class: Type[BaseAgent]) -> None:
        """Register new agent type"""
        if not issubclass(agent_class, BaseAgent):
            raise ValueError(f"Agent class must inherit from BaseAgent")
            
        cls._agent_types[name] = agent_class
        
    @classmethod
    def create_agent(cls, agent_type: str) -> IAgent:
        """Create agent of specified type"""
        if agent_type not in cls._agent_types:
            raise ValueError(f"Unknown agent type: {agent_type}")
            
        agent_class = cls._agent_types[agent_type]
        return agent_class()
        
    @classmethod
    def get_available_agent_types(cls) -> Dict[str, Type[BaseAgent]]:
        """Get dictionary of available agent types"""
        return cls._agent_types.copy()
