from abc import ABC, abstractmethod
from typing import Any, Dict, List

class IAgent(ABC):
    """Interface for all agents"""
    
    @property
    @abstractmethod
    def name(self) -> str:
        """Get agent name"""
        pass
        
    @property
    @abstractmethod
    def platform(self) -> str:
        """Get agent platform"""
        pass
        
    @property
    @abstractmethod
    def functions(self) -> List[str]:
        """Get list of agent functions"""
        pass
        
    @abstractmethod
    def run(self, task: Dict[str, Any]) -> Dict[str, Any]:
        """Run agent with given task"""
        pass
        
    @abstractmethod
    def get_status(self) -> Dict[str, Any]:
        """Get agent status"""
        pass
        
    @abstractmethod
    def stop(self) -> None:
        """Stop agent"""
        pass
