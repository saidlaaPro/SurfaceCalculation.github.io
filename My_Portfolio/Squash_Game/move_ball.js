function move_ball(){
    let pre_pos =[xb,yb];
    
    // Updating the horizontal position of the ball
    if (ball_direction_h=='right'){
        if (xb<cnv_wdt-15){
            xb+=pas_ball;
        }else{
            ball_direction_h='left';
            xb-=pas_ball;
        }
    }else{ // ball direction => left
        if(xb>15){
            xb-=pas_ball;    
        }else{
            xb+=pas_ball;
            ball_direction_h='right';
        }
    }
    // Updating the vertical position of the ball
    if (ball_direction_v=='down'){
        if (yb<cnv_ht-10 && !(yb==cnv_ht-30 && pre_pos[0]>=X_Range[pb]-8 && pre_pos[0]<X_Range[pb]+150+8) ){
            
            yb+=pas_ball;
        }else{
            yb-=pas_ball;
            ball_direction_v='up';
        }
    }else{ // ball direction => up
        if(yb>10){
            yb-=pas_ball;    
        }else{
            yb+=pas_ball;
            ball_direction_v='down';
        }
    }
    if(yb>cnv_ht-11){
        alert('Game Over');
        clearInterval(start_off);
        clearInterval(slide);
        btn_start.innerHTML='Restart';
        btn_pause.disabled=true;
        btn_start.disabled=false;
    }
    
    contexte.clearRect(pre_pos[0]-10,pre_pos[1]-10,20,20);
    contexte.beginPath();
    contexte.fillStyle = 'white';
    contexte.arc(xb,yb,10,0,2*Math.PI);
	contexte.fill();
}