===============================================
  FLOWGRAPH - Maximum Flow Visualizer
===============================================

PURPOSE:
--------
FlowGraph is an interactive educational tool for visualizing the Ford-Fulkerson
maximum flow algorithm on directed graphs. It helps students and professionals
understand how maximum flow is computed step-by-step in a flow network.

MAIN FEATURES:
--------------
1. Interactive Graph Editor
   - Add nodes (vertices) by clicking "Add Node"
   - Add directed edges with custom capacities
   - Drag nodes to reposition them
   - Source node labeled "α" (alpha)
   - Sink node labeled "ω" (omega)

2. Two Execution Modes
   a) Step-by-Step Mode (Interactive)
      - Navigate through each step of the algorithm
      - See augmenting paths highlighted in real-time
      - Use Previous/Next buttons to control progress
      - Auto-play option available with Play/Pause button

   b) Full Execution Mode (Automatic)
      - Algorithm runs to completion immediately
      - Shows final result with complete capacity evolution
      - No step controls, but full table visible

3. Residual Capacity Table
   - Shows how edge capacities change at each step
   - Columns represent algorithm steps
   - Rows represent edges (labeled as AB, BC, etc.)
   - Current step highlighted in blue
   - Changed values highlighted in amber
   - Available in both execution modes

4. Algorithm Log
   - Displays timestamped or step-indexed messages
   - Shows which paths were found
   - Records flow augmentation amounts
   - Scrollable for long executions

BASIC USAGE:
------------
1. BUILD YOUR GRAPH:
   - Start with default source (α) and sink (ω) nodes
   - Click "Add Node" to create intermediate nodes
   - Use "Add Edge" section to create directed connections:
     * Select source node from dropdown
     * Select target node from dropdown
     * Enter capacity value
     * Click "Add Edge"

2. CHOOSE EXECUTION MODE:
   - Check "Step-by-step resolution" for interactive mode
   - Leave unchecked for instant full execution

3. RUN THE ALGORITHM:
   - Click "Start Algorithm" button
   - In step-by-step mode:
     * Click "Next" to advance one step
     * Click "Previous" to go back
     * Click "Play" for automatic progression
   - Watch the graph update with highlighted paths
   - Observe capacity changes in the table

4. ANALYZE RESULTS:
   - Review the residual capacity table
   - Check the algorithm log for details
   - Final maximum flow value shown in log
   - Graph displays final flow/capacity on each edge

5. RESET OR MODIFY:
   - Click "Back to Resolution Mode" to change mode
   - Click "Reset Graph" to start over
   - Build a new graph and run again

TECHNICAL DETAILS:
------------------
- Algorithm: Ford-Fulkerson with BFS (Edmonds-Karp variant)
- Pathfinding: Breadth-First Search for augmenting paths
- Technology: React + TypeScript + Tailwind CSS
- Visualization: SVG-based interactive graph rendering
- Layout: Resizable panels for optimal space usage

UNDERSTANDING THE VISUALIZATION:
---------------------------------
- Green nodes: Source (α)
- Red nodes: Sink (ω)
- Blue nodes: Intermediate vertices
- Edge labels: "flow/capacity" (e.g., "5/10" means 5 units flowing through capacity 10)
- Green highlighted edges: Current augmenting path being processed
- Green glow on nodes: Part of the current augmenting path

TIPS:
-----
- Start with simple graphs (3-4 nodes) to understand the algorithm
- Use step-by-step mode for learning
- Resize panels to focus on graph or table as needed
- Check the log to understand algorithm decisions
- The table helps track how residual capacities decrease

EDUCATIONAL USE:
----------------
This tool is ideal for:
- Computer Science courses (Algorithms, Graph Theory)
- Operations Research classes
- Network optimization studies
- Self-learning maximum flow algorithms
- Understanding Ford-Fulkerson method visually

For questions, issues, or contributions, please refer to the project repository.

Version: 1.0
Last Updated: 2026
