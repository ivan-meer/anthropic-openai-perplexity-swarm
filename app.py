from flask import Flask, jsonify, request
from swarm_framework.core.engine import SwarmEngine
from swarm_framework.api.agents import AgentsAPI

app = Flask(__name__)
engine = SwarmEngine()
agents_api = AgentsAPI(version="v1")

# API routes
@app.route("/api/v1/agents", methods=["GET"])
def list_agents():
    """Get list of all agents"""
    agents = engine.list_agents()
    return jsonify({
        "agents": [
            {
                "name": agent.name,
                "platform": agent.platform,
                "functions": agent.functions,
                "status": agent.get_status()
            }
            for agent in agents
        ]
    })

@app.route("/api/v1/agents", methods=["POST"])
def create_agent():
    """Create new agent"""
    data = request.json
    agent_type = data.get("type")
    if not agent_type:
        return jsonify({"error": "Agent type is required"}), 400
        
    try:
        agent = engine.create_agent(agent_type)
        return jsonify({
            "agent": {
                "name": agent.name,
                "platform": agent.platform,
                "functions": agent.functions,
                "status": agent.get_status()
            }
        })
    except ValueError as e:
        return jsonify({"error": str(e)}), 400

@app.route("/api/v1/agents/<agent_name>", methods=["GET"])
def get_agent(agent_name):
    """Get agent details"""
    agent = engine.get_agent(agent_name)
    if not agent:
        return jsonify({"error": "Agent not found"}), 404
        
    return jsonify({
        "agent": {
            "name": agent.name,
            "platform": agent.platform,
            "functions": agent.functions,
            "status": agent.get_status()
        }
    })

@app.route("/api/v1/agents/<agent_name>/tasks", methods=["POST"])
def run_task(agent_name):
    """Run task on agent"""
    agent = engine.get_agent(agent_name)
    if not agent:
        return jsonify({"error": "Agent not found"}), 404
        
    task = request.json
    try:
        result = engine.run_task(agent_name, task)
        return jsonify(result)
    except Exception as e:
        return jsonify({"error": str(e)}), 400

@app.route("/api/v1/agents/<agent_name>", methods=["DELETE"])
def remove_agent(agent_name):
    """Remove agent"""
    try:
        engine.remove_agent(agent_name)
        return jsonify({"status": "success"})
    except ValueError as e:
        return jsonify({"error": str(e)}), 404

if __name__ == "__main__":
    # Create default content creator agent
    engine.create_agent("content_creator")
    app.run(debug=True)
