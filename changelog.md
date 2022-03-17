# Version 0.5.0

# Bug Fixes

-   Fixed a bug in AdjacencyList where it was never updated when vertices where put as adjacent.

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
