
import matplotlib.pyplot as plt
from mpl_toolkits.mplot3d import Axes3D
from mpl_toolkits.mplot3d.art3d import Line3DCollection
import numpy as np
import json
import sys

def make_sphere(center, radius, tsteps=20, psteps=15, plotting=False):
    x = lambda t, a: radius * np.cos(t) * np.sin(a) + center[0]
    y = lambda t, a: radius * np.sin(t) * np.sin(a) + center[1]
    z = lambda t, a: radius * np.cos(a) + center[2]
    createPoint = lambda t, a: tuple(np.round((x(t,a), y(t,a), z(t, a)), 2))

    trange = np.linspace(0, 2*np.pi, tsteps)
    prange = np.linspace(0, np.pi, psteps)

    pointIndexLookup = {}
    top = createPoint(0, 0)

    points = [top]
    rows = [ [0] ]

    for p in prange[1:-1]:
        row = []
        for t in trange:
            point = createPoint(t, p)
            points.append(point)
            row.append(len(points) - 1)

        row.append(row[0]) # make them loop back around
        rows.append(row)

    bottom = createPoint(0, np.pi)
    points.append(bottom)
    rows.append( [len(points) - 1] )

    polys = []
    # top polys
    for i, point in enumerate(rows[1][:-1]):
        next_point = rows[1][i + 1]
        polys.append( (0, point, next_point) )

    # middle polys
    for r, row in enumerate(rows[1:-2]):
        next_row = rows[r + 2]
        for i, point in enumerate(row[:-1]):
            ul = point
            ur = row[i+1]
            bl = next_row[i]
            br = next_row[i+1]
            polys.append( (ul, ur, br, bl) )

    # bottom polys
    last_point = len(points) - 1
    for i, point in enumerate(rows[-2][:-1]):
        next_point = rows[-2][i + 1]
        polys.append( (point, next_point, last_point) )

    if plotting:
        fig = plt.figure()
        ax = Axes3D(fig)
        limits = lambda c: np.array([-radius*1.1 - c, radius*1.1 + c])
        ax.set_xlim(limits(center[0]))
        ax.set_ylim(limits(center[1]))
        ax.set_zlim(limits(center[2]))
        for poly in polys:
            verts = [[points[i] for i in poly]]
            ax.add_collection3d(Line3DCollection(verts))
        plt.show()

    return points, polys


if __name__ == '__main__':
    arglen = len(sys.argv)
    opts = {}
    opts['tsteps'] = 20 if arglen < 2 else sys.argv[1]
    opts['psteps'] = 15 if arglen < 3 else sys.argv[2]
    opts['plotting'] = False if arglen < 4 else True

    origin = (0, 0, 0)
    points, polys = make_sphere(origin, 25, **opts)

    for thing in [points, polys]:
        print(len(thing))
        for item in thing:
            print(','.join([str(p) for p in item]))
