# Version 0.5.0

## New Features

-   Add weighted edges

## Bug Fixes

-   AdjacencyList now updates (never changed prior).
-   g.getEdges(a, b) now correctly works with the isDirected() method (the logic was the inverse of the intention)
-   g.deleteEdge(...e) does no longer update ajacency matrix and adjacencyList wrongly if another edge keeps an adjacency alive #24

# Version 0.4.x

No actual changes. Used for tuning publishing process

# Version 0.3.2 (Should have been 0.4.0)

## New Features

-   added `getAttachedEdges(vertex: V)` method on `Graph`
-   added `getOutgoingEdges(vertex: V)` method on `Graph`
-   added `getIncomingEdges(vertex: V)` method on `Graph`

# Version 0.3.1

## Improvements

-   reduce package size significantly using lodash only for cloneDeep

# Version 0.3.0

## New Features

-   added `deleteVertex(...vertex: V[])` methode on `Graph`
-   added `deleteEdge(...edge: E[])` methode on `Graph`
