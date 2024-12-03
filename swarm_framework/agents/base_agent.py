from typing import Any, Dict, List
from .interfaces import IAgent

class BaseAgent(IAgent):
    """Base class for all agents"""
    
    def __init__(self, name: str, platform: str, functions: List[str]):
        self._name = name
        self._platform = platform
        self._functions = functions
        self._is_running = False
        self._status = {
            "status": "initialized",
            "current_task": None,
            "errors": []
        }
        
    @property
    def name(self) -> str:
        return self._name
        
    @property
    def platform(self) -> str:
        return self._platform
        
    @property
    def functions(self) -> List[str]:
        return self._functions
        
    def run(self, task: Dict[str, Any]) -> Dict[str, Any]:
        """Run agent with given task"""
        try:
            self._is_running = True
            self._status["status"] = "running"
            self._status["current_task"] = task
            
            # Implement task execution logic in subclasses
            result = self._execute_task(task)
            
            self._status["status"] = "completed"
            return result
            
        except Exception as e:
            self._status["status"] = "error"
            self._status["errors"].append(str(e))
            raise
            
        finally:
            self._is_running = False
            self._status["current_task"] = None
            
    def get_status(self) -> Dict[str, Any]:
        """Get agent status"""
        return self._status
        
    def stop(self) -> None:
        """Stop agent"""
        if self._is_running:
            self._is_running = False
            self._status["status"] = "stopped"
            self._status["current_task"] = None
            
    def _execute_task(self, task: Dict[str, Any]) -> Dict[str, Any]:
        """Execute task - to be implemented by subclasses"""
        raise NotImplementedError("Subclasses must implement _execute_task method")
