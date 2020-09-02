# VisualizationProject_Surface_Calculation
This project is about an application that allows the user to draw a simple or complexe shape, either by using the mouse or entering the coordinates of the dots making the shape. Then, it calculate the surface.
The calculation process : 
1- define the smallest rectangle that surround the shape, using the further dots of the shape : upwards, downwrads, to left and to the right.
2- figure out the surface of the space between the surrounding rectangle and the shape. Generaly, it's easy to figure this outer surface by dividing it into regular shapes (square, rectangle, triangle, ...) which we know how to calculate its surfaces.
3- If it's not easy to calculate the surface of that outer space, the case where some areas  are covered by a part of the principal shape, we can apply the the same process above on each of them, which means using a recursive function to get the external surface.
Once we get the external surface (the space between the rectangle surrounding the shape drawn by the user and the shape itself), we get conclude the actual surface of the shape.

Ultimately, some animation are added to show the user a general idea about the process of calculating the surface.
