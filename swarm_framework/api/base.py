from abc import ABC, abstractmethod
from typing import Any, Dict

class BaseAPI(ABC):
    """Base class for all API endpoints"""
    
    def __init__(self, version: str = "v1"):
        self.version = version
        
    @abstractmethod
    def get(self, endpoint: str, params: Dict[str, Any] = None) -> Dict[str, Any]:
        """GET request to endpoint"""
        pass
        
    @abstractmethod
    def post(self, endpoint: str, data: Dict[str, Any] = None) -> Dict[str, Any]:
        """POST request to endpoint"""
        pass
        
    @abstractmethod
    def put(self, endpoint: str, data: Dict[str, Any] = None) -> Dict[str, Any]:
        """PUT request to endpoint"""
        pass
        
    @abstractmethod
    def delete(self, endpoint: str) -> Dict[str, Any]:
        """DELETE request to endpoint"""
        pass
