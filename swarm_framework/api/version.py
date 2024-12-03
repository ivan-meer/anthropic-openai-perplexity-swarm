from dataclasses import dataclass
from typing import List

@dataclass
class APIVersion:
    """Class for API versioning"""
    
    major: int
    minor: int
    patch: int
    
    @property
    def version_string(self) -> str:
        """Get version string in format 'vX.Y.Z'"""
        return f"v{self.major}.{self.minor}.{self.patch}"
    
    @classmethod
    def from_string(cls, version_str: str) -> 'APIVersion':
        """Create APIVersion from string 'vX.Y.Z'"""
        if not version_str.startswith('v'):
            raise ValueError("Version string must start with 'v'")
            
        version_parts = version_str[1:].split('.')
        if len(version_parts) != 3:
            raise ValueError("Version string must be in format 'vX.Y.Z'")
            
        try:
            major, minor, patch = map(int, version_parts)
            return cls(major=major, minor=minor, patch=patch)
        except ValueError:
            raise ValueError("Version numbers must be integers")
    
    def is_compatible_with(self, other: 'APIVersion') -> bool:
        """Check if this version is compatible with other version"""
        return self.major == other.major and self.minor >= other.minor
