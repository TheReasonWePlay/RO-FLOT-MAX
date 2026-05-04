# FlowGraph - Usage Guide

## Building Your Graph

### Adding Nodes
1. Click the **"Add Node"** button in the left sidebar
2. A new intermediate node (labeled A, B, C, etc.) will appear on the graph
3. Drag the node to position it where you want

### Adding Edges
1. In the **"Add Edge"** section:
   - Select a **source node** from the dropdown
   - Select a **target node** from the dropdown
   - Enter the **capacity** (must be a positive number)
2. Click **"Add Edge"**
3. The directed edge will appear with an arrow pointing from source to target

### Deleting Nodes
1. Click on a node to select it (it will be highlighted with a blue glow)
2. In the left sidebar, you'll see the node details
3. Click the **"Delete Node"** button (red with trash icon)
4. **Note:** Source (α) and sink (ω) nodes cannot be deleted
5. Deleting a node automatically removes all edges connected to it

### Deleting Edges
1. Click on an edge to select it (it will be highlighted in blue and thicker)
2. In the left sidebar, you'll see the edge details
3. Click the **"Delete Edge"** button (red with trash icon)

### Correcting Mistakes
- **Wrong capacity?** Delete the edge and add it again with the correct capacity
- **Wrong connection?** Delete the edge and create a new one
- **Node in wrong place?** Just drag it to the correct position
- **Need to start over?** Click "Reset Graph" in the top navigation bar

## Running the Algorithm

### Step 1: Choose Your Mode

**Step-by-Step Mode (Interactive)**
- Check the ☑ **"Step-by-step resolution"** checkbox
- Best for learning and understanding the algorithm
- You control the pace with Previous/Next buttons
- See each augmenting path highlighted as it's found

**Full Execution Mode (Automatic)**
- Leave the checkbox unchecked
- Algorithm runs to completion immediately
- Final graph state and capacity table are displayed
- Good for quickly finding the maximum flow

### Step 2: Start the Algorithm
- Click the **"Start Algorithm"** button
- The graph editing will be locked (you can't modify nodes/edges during execution)
- The algorithm will begin finding augmenting paths

### Step-by-Step Controls (Interactive Mode)

**Next Button**
- Advances one step forward
- Shows the next augmenting path or computation

**Previous Button**
- Goes back one step
- Useful for reviewing what just happened

**Play Button**
- Automatically advances steps every 1.5 seconds
- Changes to "Pause" button while playing
- Great for automated demonstrations

**Step Counter**
- Shows current step number and total steps
- Example: "3 / 7" means you're on step 3 of 7

### Understanding the Visualization

**Node Colors:**
- 🟢 **Green**: Source node (α)
- 🔴 **Red**: Sink node (ω)
- 🔵 **Blue**: Intermediate nodes

**Edge Labels:**
- Format: `flow/capacity`
- Example: `5/10` means 5 units of flow through a capacity of 10
- Residual capacity = capacity - flow = 5

**Highlighted Paths:**
- 🟢 **Green glow** on edges: Current augmenting path being processed
- 🟢 **Green glow** on nodes: Nodes in the current path
- This shows you exactly which path the algorithm found

**Edge Selection:**
- 🔵 **Blue highlight**: Selected edge (thicker line with glow)
- Click any edge to see its details in the sidebar

**Node Selection:**
- 🔵 **Blue glow**: Selected node (thicker border)
- Click any node to see its details in the sidebar

## Reading the Capacity Table

The **Residual Capacity History** table shows how edge capacities evolve:

**Table Structure:**
- **Rows**: Each edge (labeled like AB, BC, Aω, etc.)
- **Columns**: Algorithm steps (Step 0, Step 1, Step 2, ...)
- **Values**: Residual capacity at that step

**Color Coding:**
- 🔵 **Blue column**: Current step (in step-by-step mode)
- 🟡 **Amber cell**: Capacity changed from previous step
- ⚪ **White cell**: Capacity unchanged

**Example:**
```
Edge | Step 0 | Step 1 | Step 2
-----|--------|--------|--------
αA   |   10   |    6   |    6     ← Reduced by 4 in step 1
AB   |    5   |    5   |    1     ← Reduced by 4 in step 2
```

## Returning to Editing

**Back to Resolution Mode Button**
- Appears at the top of the sidebar when algorithm is running
- Click it to stop the algorithm and return to editing mode
- Your graph structure is preserved
- You can modify the graph and run the algorithm again

**Reset Graph Button**
- Located in the top navigation bar
- Completely clears the graph
- Returns to initial state with only source (α) and sink (ω)
- Use this to start building a completely new graph

## Tips for Best Results

1. **Start Simple**: Begin with 3-4 nodes to understand how the algorithm works
2. **Use Step-by-Step Mode First**: Great for learning
3. **Watch the Paths**: Pay attention to the green highlighting to see which paths are found
4. **Check the Table**: See how capacities decrease as flow increases
5. **Experiment**: Try different graph structures to see how the maximum flow changes
6. **Fix Mistakes Early**: Delete and recreate edges if you made an error - it's faster than resetting

## Common Questions

**Q: Can I delete the source or sink?**
A: No, every flow network needs exactly one source and one sink.

**Q: What happens if I delete a node that has edges?**
A: All edges connected to that node are automatically deleted.

**Q: Can I edit the graph while the algorithm is running?**
A: No, editing is locked during execution. Use "Back to Resolution Mode" first.

**Q: What if there's no path from source to sink?**
A: The algorithm will complete immediately with a maximum flow of 0.

**Q: Can I create multiple edges between the same two nodes?**
A: Yes, but it's usually better to use a single edge with combined capacity.

**Q: How do I change an edge's capacity?**
A: Delete the edge and create it again with the new capacity.

## Keyboard Tips

- **Click**: Select nodes and edges
- **Drag**: Move nodes around
- **Click empty space**: Deselect current selection

---

**Need Help?** Refer to README.txt for more detailed information about the algorithm and features.
