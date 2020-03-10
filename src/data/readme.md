# xyz file format
```
number of points
[a line with the 3D coordinates of each point]
number of polygons
[a line listing the indices of each point in each polygon]
```

The polygon point indices must all be defined in the same order (ie. all clockwise or all counter-clockwise). This is because for the light model to shade correctly, the normal vectors must either all point in or all point out. You can invert the normal vectors by setting the `inverted` flag on the Shape object ([example](https://github.com/pirtleshell/graphics/blob/master/src/index.js#L94)).
