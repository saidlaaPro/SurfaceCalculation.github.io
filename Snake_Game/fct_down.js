function bas(){
  var l=a.length;
  var i =0;
				
  if( !(a[l-1]==a[l-2] && (b[l-2]-b[l-1]==32 || b[l-1]-b[l-2]>32))){
	contexte.clearRect(0,0,320,514);
	var hx=a[l-1]; // get the coordinates o the head
            var hy=b[l-1];
	
	if (hy==v[15]){  // change the position of the head downwards..
                b[l-1]=v[0];
            }else{
                b[l-1] += 32;
            }
					
	if (a[l-1]==v[fx] && b[l-1]==v[fy]) // if the snake's head get into the fruit.
	{
		a.splice(l-1,0,hx);  // insert the previous position of the head in the snake, just before the new position.
                        b.splice(l-1,0,hy);
		coords_fruit();
	}else{
		for(i=0; i<l-2;i++){
			a[i] = a[i+1];
			b[i] = b[i+1];
		}		
		// move the element just beore the head :
		a[i]=hx;
		b[i]=hy;
	}
		
	draw_snake();
	draw_fruit(fx,fy);
	check_bitten()
					
	}else{ haut(); }
}