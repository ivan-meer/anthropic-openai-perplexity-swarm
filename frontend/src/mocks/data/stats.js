export const mockStats = {
  totalTasks: 1248,
  completedTasks: 1156,
  activeAgents: 4,
  totalAgents: 5,
  averageTime: 2.5,
  tasksByType: {
    content: 450,
    seo: 380,
    translation: 326
  },
  tasksByStatus: {
    completed: 1156,
    running: 52,
    failed: 40
  },
  agentPerformance: [
    {
      name: "Content Creator",
      tasks: 450,
      successRate: 96
    },
    {
      name: "Fact Checker",
      tasks: 380,
      successRate: 92
    },
    {
      name: "Translator",
      tasks: 326,
      successRate: 94
    },
    {
      name: "Analytics",
      tasks: 92,
      successRate: 98
    }
  ]
};
