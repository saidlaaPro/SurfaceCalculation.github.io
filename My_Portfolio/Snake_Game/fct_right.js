function droite(){				
  var l=a.length;
  var i = 0;
  // flux normal
  if( !(b[l-1]==b[l-2] && ((a[l-2]-a[l-1]==32) || a[l-1]-a[l-2]>32) ) ){ // condition : si le serpent va vers le gauche et on tape 'ArrowRight' 										     // la fonction ne doit pas fonctionner
     contexte.clearRect(0,0,320,514);                                   
     
     var hx=a[l-1]; // get the coordinates o the head
     var hy=b[l-1];
     
     if (hx==v[9]){  // change the position of the head to the right.
            a[l-1]=v[0];
        }else{
            a[l-1] += 32;
        }
        
     if (a[l-1]==v[fx] && b[l-1]==v[fy]) // if the snake get into the fruit, make it a part of the snake, then générate another position for the next fruit 
     {
        a.splice(l-1,0,hx);  // insert the previous position of the head in the snake, just before the new position.
        b.splice(l-1,0,hy);
        coords_fruit();
     }else{
        for(i=0;i<l-2;i++){ // décalage à droite des éléments du serpent sans l'élément 'tête' : tout élément prends la postion de celui juste avant lui.					
            a[i] = a[i+1];
            b[i] = b[i+1];
        }
        // déplacer l'élément juste avant la tête.
        a[i]=hx;
        b[i]=hy;
     }

draw_snake();
draw_fruit(fx,fy);
check_bitten();
	  
}else{ gauche(); }  
}
