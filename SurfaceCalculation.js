let drawing_space = document.querySelector('.drawing_space');
let canvas = document.querySelector('canvas');
let contexte = canvas.getContext('2d');
let draw_button = document.querySelector('.draw_button');
let get_surface_button = document.querySelector('.get_surface_button');
let [x_coord, y_coord, surface] = document.querySelectorAll('input');
let dots = [];
let len_dots = 0;
let up_dot = {x:400, y:500, index:-1, original_index:-1}; // the upper dot
let down_dot = {x:400, y:0, index: -1, original_index: -1}; // the lower dot
let left_dot = {x:800,y:250, index: -1, original_index: -1}; // the leftmost dot
let right_dot = {x:0, y:250, index: -1, original_index: -1}; // the rightmost dot
let first_dot_count = 0;
let getSurface_execution_count = 0;
let formula = document.querySelector('.formula');

// The principal shape : 
let principalShape = {local_dots: dots, peaks: [], ext_surface: 0, subShapes: []};
// to save the initial value of the global external surface without the surface of the sub shapes
let initial_ext_surface = 0;
// to save the surfaces of direct childs of the principal shape :
let subShape_surfaces_L1 = [];
// Global edges :
let global_up_dot = up_dot;
let global_right_dot = right_dot;
let global_down_dot = down_dot;
let global_left_dot = left_dot;
// paint the dot when the the principal shape is totally set
let principalShape_set = false;
// autorisation for painting the sub shapes
let subShapes_painting_done = false;
// Autorisation to upadate canvas
let time_to_update = true;


// reset the edges :
function set_edges(cur_dot){
    if(cur_dot.x <= left_dot.x){
       left_dot = Object.assign({},cur_dot);
    }
    if(cur_dot.x >= right_dot.x){
        right_dot = Object.assign({},cur_dot);
    }
    if(cur_dot.y <= up_dot.y){
        up_dot = Object.assign({},cur_dot);
    }
    if(cur_dot.y >= down_dot.y){
        down_dot = Object.assign({},cur_dot);
    }
}
// delete the last :
document.addEventListener('keydown', deleteDot);
function deleteDot(event){
    let key_pressed = event.keyCode;
    if(key_pressed === 8 && !get_surface_button.disabled){
        let dot_deleted = dots.pop();
        len_dots--;
        // reopen the shape if the last dot is the final dot (the curve is close)
        if(first_dot_count == 2){
            first_dot_count = 1;
            draw_button.disabled = false;
        }
        // rest the edges :
        up_dot = {x:400, y:500, index:-1, original_index:-1};
        down_dot = {x:400, y:0, index: -1, original_index: -1};
        left_dot = {x:800,y:250, index: -1, original_index: -1};
        right_dot = {x:0, y:250, index: -1, original_index: -1}; 
        for(let dot of dots){
            set_edges(dot);
        }
        //////////////////
        updateCanvas();
    }
}

// draw dot by specifiying coords in respective inputs
draw_button.addEventListener('click',addDot_manually);
function addDot_manually(){
    if(x_coord.value!='' && y_coord.value!=''){
        addDot();
        updateCanvas();
    }
}
// draw dots with the mouse
canvas.addEventListener('mousemove', updateCanvasAuto);
function updateCanvasAuto(e){
    x_coord.value = e.clientX -100;
    y_coord.value = e.clientY-72; 
    updateCanvas();  
}
function updateCanvas(){
    if(time_to_update){
            // clear the canvas :
            contexte.clearRect(0,0, 800, 500);
            // Draw the pointer
            if(first_dot_count <= 1){ // curve still open
                contexte.beginPath();
                contexte.fillStyle = 'rgba(255, 192, 203,0.7)';
                contexte.arc(parseInt(x_coord.value), parseInt(y_coord.value), 4, 0, 2*Math.PI);
                contexte.fill();
            }else{                   // the shape is totally drawn.
                // Disable the draw button:
                draw_button.disabled = true;
                // retrive the global dots : 
                dots = principalShape.local_dots;
                len_dots = dots.length;
    
                // Paint our shape : 
                contexte.beginPath();
                contexte.fillStyle = 'rgba(0, 0, 0, 0.4)';
                contexte.moveTo(dots[0].x, dots[0].y);
                for(let i=1; i<len_dots; i++){
                    contexte.lineTo(dots[i].x, dots[i].y);
                }
                contexte.lineTo(dots[0].x, dots[0].y);
                contexte.fill();
                // Paint the external surface of Level 0 when the principal shape's setting is done :
                if(principalShape_set){
                    paint_Ext_Surface(principalShape, up_dot, right_dot, down_dot, left_dot, 'rgba(0, 128, 0, 0.6)');
                }
            }
            // re-paint the subShapes of the first level : when the process is done
            if(subShapes_painting_done){
                for( let subShape of principalShape.subShapes){
                    let local_dots = subShape.local_dots;
                    contexte.beginPath();
                    contexte.fillStyle = 'rgb(2, 80, 2)';
                    contexte.moveTo(local_dots[0].x, local_dots[0].y);
                    for(let i = 1 ; i < local_dots.length; i++ ){
                        contexte.lineTo(local_dots[i].x, local_dots[i].y);
                    }
                    contexte.lineTo(local_dots[0].x, local_dots[0].y);
                    contexte.fill();
                }
            }
            // re-draw the dots after clearing the whole canvas
            for (let dot of dots){
                contexte.beginPath();
                contexte.fillStyle = 'rgba(255, 192, 203,0.6)';
                contexte.arc(dot.x, dot.y, 4, 0, 2*Math.PI);
                contexte.fill();
            }
            // draw lines between dots.
            if(len_dots >= 2){
                contexte.beginPath();
                contexte.strokeStyle = 'pink';
                contexte.lineWidth = '1';
                contexte.moveTo(dots[0].x , dots[0].y);
                for(let i=1; i<len_dots; i++){
                    contexte.lineTo(dots[i].x , dots[i].y);
                }
                if(first_dot_count == 2){
                    contexte.lineTo(dots[0].x, dots[0].y);
                }
                contexte.stroke();
            }
            // draw the four dots : Up, Down, Left, Right
            /* firstly, we have to update the global_edges if the shape is not complete */
            if(!draw_button.disabled){
                global_up_dot = up_dot;
                global_right_dot = right_dot;
                global_down_dot = down_dot;
                global_left_dot = left_dot;
            }

            contexte.beginPath();
            contexte.fillStyle = 'rgba(255, 145, 0, 0.6)';
            contexte.arc(global_up_dot.x, global_up_dot.y, 4, 0, 2*Math.PI);
            contexte.fill();
    
            contexte.beginPath();
            contexte.fillStyle = 'rgba(255, 145, 0, 0.6)';
            contexte.arc(global_left_dot.x, global_left_dot.y, 4, 0, 2*Math.PI);
            contexte.fill();
    
            contexte.beginPath();
            contexte.fillStyle = 'rgba(255, 145, 0, 0.6)';
            contexte.arc(global_right_dot.x, global_right_dot.y, 4, 0, 2*Math.PI);
            contexte.fill();
    
            contexte.beginPath();
            contexte.fillStyle = 'rgba(255, 145, 0, 0.6)';
            contexte.arc(global_down_dot.x, global_down_dot.y, 4, 0, 2*Math.PI);
            contexte.fill();
    
            // check if the current dot is on one of the existing ones.
            let current_dot = {x: parseInt(x_coord.value), y: parseInt(y_coord.value)};
            for(let dot of dots){
                if(dot.x == current_dot.x && dot.y == current_dot.y){
                    contexte.beginPath();
                    contexte.fillStyle = 'greenyellow';
                    contexte.arc(dot.x, dot.y, 6, 0, 2*Math.PI);
                    contexte.fill();
                }
            }
            // draw the rectangle making the frame for the shape
            contexte.beginPath();
            contexte.strokeStyle ='rgba(255,255,255,0.2)';
            contexte.lineWidth = '1';
            contexte.moveTo(global_left_dot.x,  global_up_dot.y);
            contexte.lineTo(global_right_dot.x, global_up_dot.y);
            contexte.lineTo(global_right_dot.x, global_down_dot.y);
            contexte.lineTo(global_left_dot.x,  global_down_dot.y);
            contexte.lineTo(global_left_dot.x,  global_up_dot.y);
            contexte.stroke();
    }
}

// Clear the canvas when the pointer get out of the canvas
canvas.addEventListener('mouseout', clearCoords);
function clearCoords(){
    if(!draw_button.disabled){
        contexte.clearRect(x_coord.value-4, y_coord.value-4,8 , 8);
    }
    x_coord.value = '';
    y_coord.value = '';
}
// get the surface by clicking the respective button
get_surface_button.addEventListener('click',getSurfaceByButton);
function getSurfaceByButton(){
    getSurface();
    get_surface_button.disabled = true;
    time_to_update = false;
}
// Add the current dot to the array containing all the dots.
function addDot(){
    let cur_dot = {x: parseInt(x_coord.value), y: parseInt(y_coord.value), index: len_dots, original_index: -1 };
    let draw_permission = true;
    if(len_dots > 0){
        //  make sure to avoid double dot.
        for( dot of dots){
            if(dot.x==cur_dot.x && dot.y==cur_dot.y){
                if(len_dots<3){                                               // with less than 3 dots we can't make a shape !
                    draw_permission = false;
                }else if(cur_dot.x != dots[0].x  &&  cur_dot.y != dots[0].y){ // the last dot should meet only the first dot
                    draw_permission = false;
                }
            }
        }
        // and if we have 2 occurrence of the first dot, we should stop the process of drawing, as the shape is hereby close.
        if(first_dot_count > 1){
            draw_permission = false;
        }
    }
    // Now, we'll deal with new dots : draw and add them to the list of the all dots.
    if ( draw_permission ){
        // add the new dot to the list
        len_dots = dots.push(cur_dot);
        // count the number of occurence of the first dot.
        if(cur_dot.x == dots[0].x  &&  cur_dot.y == dots[0].y){
            first_dot_count++;
        }
        // draw lines between dots.
        if(len_dots >= 2){
            contexte.beginPath();
            contexte.strokeStyle = 'pink';
            contexte.lineWidth = '2';
            contexte.moveTo(dots[len_dots - 2].x , dots[len_dots - 2].y);
            contexte.lineTo(dots[len_dots - 1].x , dots[len_dots - 1].y);
            contexte.stroke();
        }
        // remove the last dot from global list if the shape is complete (otherwise we'll have a double dot: final_dot = first_dot)
        if(first_dot_count == 2){
            let removed_dot = dots.pop();
            len_dots--;
        }
        // reset the coordinates the 4 dots at the 4 edges of the shape : Up, Dow,... ;
        // this reset should not be done after removing the last dot. (i.e: nbr of first_dot ocuurence <2 )
        if(first_dot_count < 2){
            set_edges(cur_dot);
        }
    }else{ // draw_perssion = false
        if(first_dot_count <= 1){ // curve not closed yet
            alert('The current dot, should not be drawn there !');
        }
    }
}
canvas.addEventListener('click',addDot);
// Painting the external surface
function paint_Ext_Surface(shape, up_dot, right_dot, down_dot, left_dot, color){

    ///////////////////////////////////////
    contexte.beginPath();   // Up Side
    contexte.fillStyle = color;
    contexte.lineTo(global_right_dot.x, up_dot.y);
    contexte.moveTo(global_left_dot.x, up_dot.y);
    for( let peak of shape.peaks[0]){
        contexte.lineTo(peak.x, peak.y);
    }
    contexte.lineTo(global_right_dot.x, up_dot.y);
    contexte.fill();
    //////////////////////////////////////
    contexte.beginPath();   // Right Side
    contexte.fillStyle = color;
    contexte.moveTo(right_dot.x, global_up_dot.y);
    for( let peak of shape.peaks[1]){
        contexte.lineTo(peak.x, peak.y);
    }
    contexte.lineTo(right_dot.x, global_down_dot.y);
    contexte.lineTo(right_dot.x, global_up_dot.y);
    contexte.fill();
    //////////////////////////////////////
    contexte.beginPath();   // Down Side
    contexte.fillStyle = color;
    contexte.lineTo(global_left_dot.x, down_dot.y);
    contexte.moveTo(global_right_dot.x, down_dot.y);
    for( let peak of shape.peaks[2]){
        contexte.lineTo(peak.x, peak.y);
    }
    contexte.lineTo(global_left_dot.x, down_dot.y);
    contexte.fill();
    ///////////////////////////////////////
    contexte.beginPath(); //  left Side
    contexte.fillStyle = color;
    contexte.moveTo(left_dot.x, global_up_dot.y);
    contexte.lineTo(left_dot.x, global_down_dot.y);
    for( let peak of shape.peaks[3]){ // left_peaks
    contexte.lineTo(peak.x, peak.y);
    }
    contexte.lineTo(left_dot.x, global_up_dot.y);
    contexte.fill();
}
// Now let's get to The process of calculating the surface of the shape
function getSurface(){
    global_up_dot = Object.assign({},up_dot);
    global_right_dot = Object.assign({},right_dot);
    global_down_dot = Object.assign({},down_dot);
    global_left_dot = Object.assign({},left_dot);

    function get_edges(){
        if(dots.length != principalShape.local_dots.length){ // Current Shape  # Principal Shape 
            // set the initial values (the opposite of the global edges: that's vital for the process)
            up_dot = {x:400, y:500, index:-1, original_index:-1}; // the upper dot
            down_dot = {x:400, y:0, index: -1, original_index: -1}; // the lower dot
            left_dot = {x:800,y:250, index: -1, original_index: -1}; // the leftmost dot
            right_dot = {x:0, y:250, index: -1, original_index: -1}; // the rightmost dot

            for (dot of dots){
                set_edges(dot);
            }
        }
    }
    /////////////////////
    let rotation_direction = 'clockwise'; // this will help to know surely the dots btw each couple of the 4 utmost dots

    function get_RotationDirection(){
        rotation_direction = 'clockwise';
        // let's find the direction of rotation chosen while drawing
        // to do so, we'll compare the indexes of two dots surrounding the Upper Dot (Up_dot)
        let to_up_dot = up_dot ; // the dot that is drawn just before the top dot
        let from_up_dot = up_dot ;  // the dot that is drawn just after  the top dot
        if(up_dot.index == 0){
            to_up_dot = dots[len_dots-1];
            from_up_dot = dots[1];
        }else if(up_dot.index == len_dots-1){
            to_up_dot = dots[len_dots-2];
            from_up_dot = dots[0];
        }else{
            to_up_dot = dots[up_dot.index - 1];
            from_up_dot = dots[up_dot.index + 1];
        }
        // calculate the angle btw [local_up_dot   before_up_dot] and [local_up_dot   after_up_dot]
        let to_up_vect = [(to_up_dot.x - up_dot.x),(to_up_dot.y - up_dot.y), 0 ]; // 3 Dimensions
        let from_up_vect = [(from_up_dot.x - up_dot.x),(from_up_dot.y - up_dot.y), 0 ];   // 3 Dimensions
        // let calculate the "vectorial product" of the above couple of vectors
        let vectorial_product = [(to_up_vect[1] * from_up_vect[2] - to_up_vect[2] * from_up_vect[1] ),
                                 (to_up_vect[2] * from_up_vect[0] - to_up_vect[0] * from_up_vect[2] ),
                                 (to_up_vect[0] * from_up_vect[1] - to_up_vect[1] * from_up_vect[0] )
                                ];
        // Now we can found out the direction of rotation : if the third coordiante of the vect_prod > 0 => the angle btw the couple of vects is >0 => direction_rotation = 'clockwise'
        if(vectorial_product[2] > 0){
            rotation_direction= 'anti-clockwise';
        }    
    }
    
    //  get the dots located between local edges : [left-dot && up-dot], [up-dot && right-dot], [right-dot && down-dot], [down-dot && left-dot]
    let dots_left_up = [];
    let len_dots_left_up = 0;

    let dots_left_down = [];
    let len_dots_left_down = 0;

    let dots_up_right = [];
    let len_dots_up_right = 0;

    let dots_down_right = [];
    let len_dots_down_right = 0;

    function get_dots_btw_edges(){
        // Firstly we have to initialize the array
        dots_left_up = [];
        len_dots_left_up = 0;

        dots_left_down = [];
        len_dots_left_down = 0;

        dots_up_right = [];
        len_dots_up_right = 0;

        dots_down_right = [];
        len_dots_down_right = 0;

        // getting the dots btw the edges

        if(rotation_direction == 'anti-clockwise'){
            if(left_dot.index <  up_dot.index ){      // the first dot is btw Left-dot and Up-dot
                for(let i=left_dot.index; i>=0; i--){                       // Left --- First
                    len_dots_left_up = dots_left_up.push(dots[i]);
                }
                for(let i=len_dots-1; i>=up_dot.index ; i--){               // Last --- Up
                    len_dots_left_up = dots_left_up.push(dots[i]);
                }
                for(let i=left_dot.index; i<=down_dot.index ; i++){         // Left --- Down
                    len_dots_left_down = dots_left_down.push(dots[i]);
                }
                for(let i=down_dot.index; i<=right_dot.index ; i++){        // Down --- Right
                    len_dots_down_right = dots_down_right.push(dots[i]);
                }
                for(let i=up_dot.index; i>=right_dot.index ; i--){          // Up --- Right
                    len_dots_up_right = dots_up_right.push(dots[i]);
                }
            }else{  // the first dot is after the Left dot
                if(left_dot.index !=  up_dot.index){  // Left != Up
                    for(let i=left_dot.index; i>=up_dot.index ; i--){     // Left --- Up  (Complete)
                        len_dots_left_up = dots_left_up.push(dots[i]);
                    } // Left --- Up  (Complete)
                }
                // At this stage, we have 3 possiblities for the location of the first dot [U L * D * R * U]
                if(left_dot.index > down_dot.index ){ // first dot is btw Left and Down dots [U L * D R U]
                    for(let i=left_dot.index; i<=len_dots-1 ; i++){           // Left --- Last 
                        len_dots_left_down = dots_left_down.push(dots[i]); 
                    }
                    for(let i=0; i<=down_dot.index ; i++){                    // First --- Down
                        len_dots_left_down = dots_left_down.push(dots[i]);
                    }
                    for(let i=down_dot.index; i<=right_dot.index ; i++){      // Down --- Right
                        len_dots_down_right = dots_down_right.push(dots[i]);
                    }
                    for(let i=up_dot.index; i>=right_dot.index ; i--){        // Up --- Right
                        len_dots_up_right = dots_up_right.push(dots[i]);
                    }
                }else{  // first dot is after the Left and Down Dots
                    if(left_dot.index != down_dot.index ){  // Left != down
                        for(let i=left_dot.index; i<=down_dot.index ; i++){        // Left --- Down (complete)
                            len_dots_left_down = dots_left_down.push(dots[i]); 
                        }// Left --- Down (complete)
                    }
                    // At this stage, 2 possiblities are left for the location of the first dot [U L D * R * U]
                    if(down_dot.index > right_dot.index ){  // First Dot is between Down and Right dots [U L D * R U]
                        for(let i=down_dot.index; i<=len_dots-1 ; i++){              // Down --- Last
                            len_dots_down_right = dots_down_right.push(dots[i]); 
                        }
                        for(let i=0; i<=right_dot.index ; i++){                      // First --- Right 
                            len_dots_down_right = dots_down_right.push(dots[i]); 
                        }
                        for(let i=up_dot.index; i>=right_dot.index ; i--){           // Up --- Right
                            len_dots_up_right = dots_up_right.push(dots[i]);
                        }
                    }else{ // First dot after Left, Down and Right dots => certainly btw Up and Right dots
                        if(down_dot.index != right_dot.index ){  // Down != Right
                            for(let i=down_dot.index; i<=right_dot.index ; i++){     // Down --- Right (complete)
                                len_dots_down_right = dots_down_right.push(dots[i]); 
                            }// Down --- Right (complete)
                        }
                        // At this stage, are left 1 possiblity for the location of the first dot [U L D R * U]
                        for(let i=up_dot.index; i>=0 ; i--){                    // Up --- First
                            len_dots_up_right = dots_up_right.push(dots[i]);
                        }
                        for(let i=len_dots-1; i>=right_dot.index ; i--){                    // First --- Right
                            len_dots_up_right = dots_up_right.push(dots[i]);
                        } // Up --- Right (Complete)
                        // Now, All dots are placed in the right shape.peaks[ind_arr].
                    }
                }
            }
        }else{ // rotation direction => Clockwise
            if(left_dot.index >  up_dot.index ){      // the First dot is BTW Left_dot and Up_dot
                for(let i=left_dot.index; i<=len_dots-1; i++){           // Left --- Last
                    len_dots_left_up = dots_left_up.push(dots[i]);
                }
                for(let i=0; i<=up_dot.index ; i++){                    // First --- Up
                    len_dots_left_up = dots_left_up.push(dots[i]);
                }
                for(let i=up_dot.index; i<=right_dot.index ; i++){      // Up --- Right
                    len_dots_up_right = dots_up_right.push(dots[i]);
                }
                for(let i=down_dot.index; i>=right_dot.index ; i--){    // Down --- Right
                    len_dots_down_right = dots_down_right.push(dots[i]);
                }
                for(let i=left_dot.index; i>=down_dot.index ; i--){    // Left --- Down
                    len_dots_left_down = dots_left_down.push(dots[i]);
                }
            }else{                                    // the First dot is AFTER the Left and Up dots
                if(left_dot.index !=  up_dot.index){   // Left != Up 
                    for(let i=left_dot.index; i<=up_dot.index ; i++){
                        len_dots_left_up = dots_left_up.push(dots[i]);
                    }  // Left --- Up => Definitely Complete                                                
                }
                // At this stage, we have 3 possiblities left for the location of the first dot [L  U  *  R *  D *  L]
                if(up_dot.index > right_dot.index){ // the First dot is btw Up and Right dots 
                    for(let i=up_dot.index; i<=len_dots-1 ; i++){          // Up --- Last
                        len_dots_up_right = dots_up_right.push(dots[i]);
                    }
                    for(let i=0; i<=right_dot.index ; i++){                // First --- Right
                        len_dots_up_right = dots_up_right.push(dots[i]);
                    }
                    for(let i=down_dot.index; i>=right_dot.index ; i--){   // Down --- Right
                        len_dots_down_right = dots_down_right.push(dots[i]);
                    }
                    for(let i=left_dot.index; i>=down_dot.index ; i--){    // Left --- Down
                        len_dots_left_down = dots_left_down.push(dots[i]);
                    }
                }else{  // The first dot is after the Up and Right dots [L  U  R * D * L]
                    if(up_dot.index !=  right_dot.index){   // Up != Right 
                        for(let i=up_dot.index; i<=right_dot.index ; i++){
                            len_dots_up_right = dots_up_right.push(dots[i]);       // Up ---Right
                        }  // Up--- Right => Definitely Complete                                                
                    }
                    // At this stage, we have 2 possiblities left for the location of the first dot [L  U  R * D * L]
                    if(down_dot.index < right_dot.index){ // [L  U  R *  D  L]
                        for(let i=down_dot.index; i>=0 ; i--){                      // Down --- First
                            len_dots_down_right = dots_down_right.push(dots[i]);
                        }
                        for(let i=len_dots-1; i>= right_dot.index ; i--){           // Last --- Right
                            len_dots_down_right = dots_down_right.push(dots[i]);
                        }
                        for(let i=left_dot.index; i>= down_dot.index ; i--){        // Left --- Down
                            len_dots_left_down = dots_left_down.push(dots[i]);
                        }
                    }else{  // [L  U  R  D * L] the last case
                        if(down_dot.index != right_dot.index){ // Down != Right
                            for(let i=down_dot.index; i>=right_dot.index ; i--){     // Down --- Right
                                len_dots_down_right = dots_down_right.push(dots[i]);
                            } // Down --- Right => definitely complete.
                        }
                        // At this stage, one possibility is left [L  U  R  D * L]
                        for(let i=left_dot.index; i>=0; i--){                         // Left --- First
                            len_dots_left_down = dots_left_down.push(dots[i]);
                        }
                        for(let i=len_dots-1; i>=down_dot.index; i--){                // Last --- Down
                            len_dots_left_down = dots_left_down.push(dots[i]);
                        }
                    }
                }

            }    
        }
    }

    //  Get peaks :
    let up_peaks = [left_dot];
    let len_up_peaks = 1;
    let left_peaks = [left_dot];
    let len_left_peaks = 1;
    let down_peaks = [left_dot];
    let len_down_peaks = 1;
    let right_peaks = [right_dot];
    let len_right_peaks = 1;
    
    function get_peaks(){
        // Inititalization of the arrays:
        up_peaks = [left_dot];
        len_up_peaks = 1;

        left_peaks = [left_dot];
        len_left_peaks = 1;

        down_peaks = [left_dot];
        len_down_peaks = 1;

        right_peaks = [right_dot];
        len_right_peaks = 1;

        function getVerticalpeaks(vertical_peaks, dots_btw, vertical_edge){ // vertical_edge means, the upper or the lower dot
            let len_dots_btw = dots_btw.length;
            let len_vertical_peaks = vertical_peaks.length;
            if(len_dots_btw >= 2){   // at least one dot is between the left and up dots.
                for(let i= 1; i<len_dots_btw ; i++){ // look for peaks
                    let last_peak = vertical_peaks[len_vertical_peaks - 1];
                    // look for the first dot located to the right of the last peak
                    while( i<len_dots_btw && dots_btw[i].x <= last_peak.x  ){
                        i++;
                    }
                    if(i == len_dots_btw){ break; }
                    let potential_peak = dots_btw[i];    
                    let a = (potential_peak.y - last_peak.y) / (potential_peak.x - last_peak.x); // Y = aX+b
                    let b = (potential_peak.x * last_peak.y - last_peak.x * potential_peak.y) / (potential_peak.x - last_peak.x); // Y = aX+b
                    
                    // test dots after the potential_peak
                    let j = i+1;
                    for( ; j < len_dots_btw ; j++){
                        let cur_dot = dots_btw[j];
                        if(last_peak.x <= cur_dot.x && cur_dot.x <=  potential_peak.x ){   //  cur_dot is between the last and potential peaks                       // check if the current dot (index => j) is above the line made by the peaks
                            if(Math.abs(cur_dot.y - vertical_edge.y) < Math.abs(a * cur_dot.x + b - vertical_edge.y)){ // cur_dot nearest to the edge than the segment [(last_peak) (potential_peak)]
                                potential_peak = cur_dot; 
                                // update line equation parameters :
                                a = (potential_peak.y - last_peak.y) / (potential_peak.x - last_peak.x); // Y = aX+b
                                b = (potential_peak.x * last_peak.y - last_peak.x * potential_peak.y) / (potential_peak .x - last_peak.x); // Y = aX+b
                                i = j;
                            }
                        }
                        if( (j+1 < len_dots_btw) && cur_dot.x <= potential_peak.x && potential_peak.x <= dots_btw[j+1].x &&  (cur_dot.index != potential_peak.index) ){
                            next_cur_dot = dots_btw[j+1];
                            if(next_cur_dot.x != cur_dot.x){
                                let a1 = (next_cur_dot.y - cur_dot.y) / (next_cur_dot.x - cur_dot.x); // 
                                let b1 = (next_cur_dot.x * cur_dot.y - cur_dot.x * next_cur_dot.y) / (next_cur_dot.x - cur_dot.x); // Y = a1 X + b1
                                if(Math.abs(potential_peak.y - vertical_edge.y) > Math.abs(a1 * potential_peak.x + b1- vertical_edge.y)){ // potential peak below the line [previous_dot next_dot]
                                    potential_peak = next_cur_dot; 
                                    // update line equation parameters :
                                    a = (potential_peak.y - last_peak.y) / (potential_peak.x - last_peak.x); // Y = aX+b
                                    b = (potential_peak.x * last_peak.y - last_peak.x * potential_peak.y) / (potential_peak .x - last_peak.x); // Y = aX+b
                                    i = ++j;  
                                }
                            }
                        }
                    }
                    // after the last loop we are sure, the last dot assigned to potential_peak is indeed a peak, so let's add it to the respective array
                    len_vertical_peaks = vertical_peaks.push(potential_peak);
                    last_peak = potential_peak;
                    // NB : the next peak is surely is located, in the array of dots btw L&U, after the current one, so :
                }
            }
        }
    
        function getHorizontalpeaks(horizontal_peaks, vertical_peaks, vertical_edge, dots_btw, horizontal_edge){
            // Then, let's look for the first Vertical peak :
            let first_vertical_peak = horizontal_edge;
            let first_vertical_peak_location = 0;
            let len_horizontal_peaks = horizontal_peaks.length;
            let len_vertical_peaks = vertical_peaks.length;
            for(let i=1;  i<len_vertical_peaks; i++){
                if(Math.abs(vertical_peaks[i].y - vertical_edge.y) > Math.abs(first_vertical_peak.y - vertical_edge.y)){ //if the current Vertical peak is further than the first_vertical_peak from the the vertical edge, break the loop
                    break;
                }else{
                    first_vertical_peak = vertical_peaks[i];
                    first_vertical_peak_location = i;
                }
            }
            // let's figure out how many dots are btw the first H_peak and the first V_peak
            let nbr_dots = -1;
            let len_dots_btw = dots_btw.length;
            for(let i=0; i<len_dots_btw; i++){
                if(dots_btw[i].index != first_vertical_peak.index){
                    nbr_dots++;
                }else{
                    break;
                }
            }
            if( nbr_dots >= 1 ){ // at least, two dots are between the horizontal edge and vertical edge, those dots are included
                // Evaluate each dot btw the F_H_peak and F_V_peak whether it's a H_peak.
                for(let i= 1; i<=nbr_dots ; i++){
                    let last_peak;
                    if(vertical_edge.index == up_dot.index){ // We are dealing with upper-side
                        last_peak = horizontal_peaks[len_horizontal_peaks - 1];
                    }else{                                   // We are dealing with Lower-side
                        last_peak = horizontal_peaks[0];
                    }
                    // look for the first dot located nearer to the vertical edge than the last peak
                    while( i<= nbr_dots && Math.abs(dots_btw[i].y- vertical_edge.y) >= Math.abs(last_peak.y - vertical_edge.y) ){
                        i++;
                    }
                    if(i>nbr_dots){ break; }
                    let potential_peak = dots_btw[i];    
                    let a = (potential_peak.y - last_peak.y) / (potential_peak.x - last_peak.x); // Y = aX+b
                    let b = (potential_peak.x * last_peak.y - last_peak.x * potential_peak.y) / (potential_peak.x - last_peak.x); // Y = aX+b
                    
                    // dots after the potential_peak
                    let j = i+1;
                    for( ; j <=nbr_dots ; j++){
                        let cur_dot = dots_btw[j];
                        if(Math.abs(last_peak.y - vertical_edge.y) >= Math.abs(cur_dot.y - vertical_edge.y) && Math.abs(cur_dot.y - vertical_edge.y) >= Math.abs(potential_peak.y - vertical_edge.y) ){   //  cur_dot is between the last and potential peaks                       // check if the current dot (index => j) is above the line made by the peaks
                            if(a!=0 && Math.abs(cur_dot.x- horizontal_edge.x) < Math.abs((cur_dot.y - b)/a - horizontal_edge.x)){ // cur_dot is nearer to the horizontal edge than the segment [(last_peak) (potential_peak)]
                                potential_peak = cur_dot; 
                                // update line equation parameters :
                                a = (potential_peak.y - last_peak.y) / (potential_peak.x - last_peak.x); // Y = aX+b
                                b = (potential_peak.x * last_peak.y - last_peak.x * potential_peak.y) / (potential_peak .x - last_peak.x); // Y = aX+b
                                i = j;
                            }
                        }else if( (j+1 <= nbr_dots) && Math.abs(cur_dot.y - vertical_edge.y) >= Math.abs(potential_peak.y - vertical_edge.y) && Math.abs(potential_peak.y - vertical_edge.y) >= Math.abs(dots_btw[j+1].y - vertical_edge.y) ){
                            next_cur_dot = dots_btw[j+1];
                            if(next_cur_dot.x != cur_dot.x){
                                let a1 = (next_cur_dot.y - cur_dot.y) / (next_cur_dot.x - cur_dot.x); // 
                                let b1 = (next_cur_dot.x * cur_dot.y - cur_dot.x * next_cur_dot.y) / (next_cur_dot.x - cur_dot.x); // Y = a1 X + b1
                                if(a1!=0 && Math.abs(potential_peak.x - horizontal_edge.x) > Math.abs((potential_peak.y - b1)/a1 - horizontal_edge.x)){ // potential peak is further from the edge than the line [previous_dot next_dot]
                                    potential_peak = next_cur_dot; 
                                    // update line equation parameters :
                                    a = (potential_peak.y - last_peak.y) / (potential_peak.x - last_peak.x); // Y = aX+b
                                    b = (potential_peak.x * last_peak.y - last_peak.x * potential_peak.y) / (potential_peak .x - last_peak.x); // Y = aX+b
                                    i = ++j;  
                                }
                            }
                        }
                    }
                    // after the last loop we are sure, the last dot assigned to potential_peak is indeed a peak, so let's add it to the respective array
                    if(vertical_edge.index == up_dot.index){    // Up-Side
                        len_horizontal_peaks = horizontal_peaks.push(potential_peak);
                    }else{                                      // Down-Side
                        len_horizontal_peaks = horizontal_peaks.unshift(potential_peak);
                    }
                    
                    last_peak = potential_peak;
                    
                }
            }
            // NB : the next peak is surely is located, in the array of dots btw L&U, after the current one, so :
            // Now, all the peak before the first Vertical_peak have became a Horizontal_peak, so let's remove them from the vertival_peaks list
            for(i=0; i< first_vertical_peak_location; i++){
                let peak_removed = vertical_peaks.shift();
            }
            // Add the first Up_peak (or Down_peak) as the last Left_peak (Right_peak) to the respective list
            if(vertical_edge.index == up_dot.index && nbr_dots != -1){   // Up-Side && (FHP != FVP )
                if(first_vertical_peak.index != horizontal_peaks[horizontal_peaks.length-1].index){ // (LHP != FVP )
                    len_horizontal_peaks = horizontal_peaks.push(first_vertical_peak);
                }
            }else if(first_vertical_peak_location !=0){ // avoid double first H_peak             // Down-Side
                if(first_vertical_peak.index != horizontal_peaks[0].index){ // (FHP != FVP )
                    len_horizontal_peaks = horizontal_peaks.unshift(first_vertical_peak);
                }
            }
            
        }

        // 1- Up_peaks : dots that are not between any part of the shape and the edge [a line of the surrounding rectangle]
        getVerticalpeaks(up_peaks, dots_left_up, up_dot);
        len_up_peaks = up_peaks.length;
        getVerticalpeaks(up_peaks, dots_up_right, up_dot);
        len_up_peaks = up_peaks.length;
        getVerticalpeaks(down_peaks, dots_left_down, down_dot);
        len_down_peaks = down_peaks.length;
        getVerticalpeaks(down_peaks, dots_down_right, down_dot);
        len_down_peaks = down_peaks.length;

        // 2 - Get Left_peaks : peaks that no part of shape is on its left.
        //     Left_peaks could exist only if there is at least one dot between the Left_Dot and the first Up_peak
        //     The first Up peak : is the first peak of the Up peaks !!
        getHorizontalpeaks(left_peaks, up_peaks, up_dot, dots_left_up, left_dot);
        len_left_peaks = left_peaks.length;
        getHorizontalpeaks(left_peaks,down_peaks, down_dot, dots_left_down, left_dot);
        len_left_peaks = left_peaks.length;
        // Need reversing the arrays (dots_up_right), (up_peaks), (down_right_dots) and (down_peaks)
        let dots_right_up = [];
        let len_dots_right_up = 0;
        for(let dot of dots_up_right){
            len_dots_right_up = dots_right_up.unshift(dot); // add at the beginning
        }
        let dots_right_down = [];
        let len_dots_right_down = 0;
        for(let dot of dots_down_right){
            len_dots_right_down = dots_right_down.unshift(dot); // add at the beginning
        }
        let up_peaks_reversed = [];
        let len_up_peaks_reversed = 0;
        for(let dot of up_peaks){
            len_up_peaks_reversed = up_peaks_reversed.unshift(dot); // add at the beginning
        }
        let down_peaks_reversed = [];
        let len_down_peaks_reversed = 0;
        for(let dot of down_peaks){
            len_down_peaks_reversed = down_peaks_reversed.unshift(dot); // add at the beginning
        }
        
        getHorizontalpeaks(right_peaks, up_peaks_reversed, up_dot, dots_right_up, right_dot);
        len_right_peaks = right_peaks.length;
        getHorizontalpeaks(right_peaks, down_peaks_reversed, down_dot, dots_right_down, right_dot);
        len_right_peaks = right_peaks.length;

        // reverse again the vertical peaks to get the original order
        let original_up_peaks = [];
        let len_original_up_peaks = 0;
        for(let dot of up_peaks_reversed){
            len_original_up_peaks = original_up_peaks.unshift(dot); // add at the beginning
        }
        up_peaks = original_up_peaks;
        len_up_peaks = len_original_up_peaks;

        let original_down_peaks = [];
        let len_original_down_peaks = 0;
        for(let dot of down_peaks_reversed){
            len_original_down_peaks = original_down_peaks.unshift(dot); // add at the beginning
        }
        down_peaks = original_down_peaks;
        len_down_peaks = len_original_down_peaks;
    }

    // Firstly we need to set the attributes of the principal shape object, as we haven't looked yet for neither its external surface nor its childs
    function set_shape(shape){
        // First, we have to reset the list of dots with the local_dots of the current shape
        dots = shape.local_dots;
        len_dots = shape.local_dots.length;
        // select the peaks from the dots between the edges [LU], [LD], [DR], [UR].
        // peak : dot that nothing is between it and the opposite line of the surrounding rectangle.
        // those peaks will help calculating the outer surface.
        get_edges();
            console.log('up_dot: ',up_dot);
            console.log('right_dot: ',right_dot);
            console.log('down_dot: ',down_dot);
            console.log('left_dot: ',left_dot);
        get_RotationDirection();
            console.log(rotation_direction);
        get_dots_btw_edges();
            console.log('dots_left_up: ',dots_left_up);
            console.log('dots_up_right: ',dots_up_right);
            console.log('dots_down_right: ',dots_down_right);
            console.log('dots_left_down: ',dots_left_down);
        get_peaks();
            console.log('up_peaks: ',up_peaks);
            console.log('right_peaks: ',right_peaks);
            console.log('left_peaks: ',left_peaks);
            console.log('down_peaks: ',down_peaks);
        
        // store the peaks in the current shape object in the clockwise direction : up_peaks, right_peaks, down_peaks, left_peaks
        shape.peaks[shape.peaks.length] = up_peaks;
          // reverse right peaks :
        let right_peaks_reversed = [];
        let len_right_peaks_reversed = 0;
        for(let dot of right_peaks){
            len_right_peaks_reversed = right_peaks_reversed.unshift(dot); // add at the beginning
        }
        right_peaks = right_peaks_reversed;
        len_right_peaks = len_right_peaks_reversed;
        shape.peaks[shape.peaks.length] = right_peaks;
          // reverse down peaks :
        let down_peaks_reversed = [];
        let len_down_peaks_reversed = 0;
        for(let dot of down_peaks){
            len_down_peaks_reversed =down_peaks_reversed.unshift(dot); // add at the beginning
        }
        down_peaks = down_peaks_reversed;
        len_down_peaks = len_down_peaks_reversed;
        shape.peaks[shape.peaks.length] = down_peaks;

        shape.peaks[shape.peaks.length] = left_peaks;
        //
        function calculate_Ext_Surface(){
            // Calculate the External Surface :  unit surface = ( smaller base + bigger base ) * height / 2 
            let external_surface = 0;
        
            for(let i= 1; i< left_peaks.length; i++){   // left side
                external_surface += (left_peaks[i-1].x + left_peaks[i].x - 2 * left_dot.x) * Math.abs(left_peaks[i-1].y - left_peaks[i].y) / 2
            }
        
            external_surface += (up_peaks[0].x - left_dot.x) * (up_peaks[0].y - up_dot.y);      // Left - Top  
            
            for(let i= 1; i< up_peaks.length; i++){     // Top Side
                external_surface += (up_peaks[i-1].y + up_peaks[i].y - 2 * up_dot.y) * Math.abs(up_peaks[i].x - up_peaks[i-1].x) / 2
            }
        
            external_surface += (right_dot.x - up_peaks[up_peaks.length-1].x) * (up_peaks[up_peaks.length-1].y - up_dot.y); // Top - Right
        
            for(let i= 1; i< right_peaks.length; i++){   // Right Side 
                external_surface += (-right_peaks[i-1].x - right_peaks[i].x + 2 * right_dot.x) * Math.abs(right_peaks[i-1].y - right_peaks[i].y) / 2
            }
        
            external_surface += (right_dot.x - right_peaks[right_peaks.length-1].x) * (down_dot.y - right_peaks[right_peaks.length-1].y);  // Right - Bottom
        
            for(let i= 1; i< down_peaks.length; i++){    // Bottom Side
                external_surface += (-down_peaks[i-1].y - down_peaks[i].y + 2 * down_dot.y) * Math.abs(down_peaks[i].x - down_peaks[i-1].x) / 2
            }
        
            external_surface += (left_peaks[0].x - left_dot.x) * (down_dot.y - left_peaks[0].y);     // Bottom - Left
            return external_surface;
        }
                
        // store the total external surface in the shape object.
        shape.ext_surface = calculate_Ext_Surface();
        
        // look for Sub Shapes of the current Shape :
        for (let section of shape.peaks){
            len_section = section.length;
            for(let i=1; i< len_section; i++){
                let cur_peak = section[i];
                let pre_peak = section[i-1]
                // figure out the number of dots btw each couple of successives peaks of the current shape.peaks[ind_arr]
                if(rotation_direction == 'clockwise'){
                    if(pre_peak.index < cur_peak.index){ // the first dot is not btw the current couple of peaks
                        let dif_indexes = Math.abs(cur_peak.index - pre_peak.index);
                        if(dif_indexes >= 2){ // at least one dot is btw the couple of successive peaks
                            let subShape = {local_dots:[] , peaks:[] , ext_surface: 0, subShapes:[] };
                            let min_index = Math.min(cur_peak.index, pre_peak.index);
                            // add the dots btw the 2 successive peaks in the subShape local dots array
                            let new_index = 0;
                            for(let j= min_index ; j<= min_index + dif_indexes; j++){
                                let dot = {x: 0, y:0, index: 0, original_index: 0};
                                dot.x = dots[j].x;
                                dot.y = dots[j].y;
                                dot.index = new_index++; // restart the indexes from zero
                                if(dots[j].original_index == -1){ // save the original index
                                    dot.original_index = principalShape.local_dots[j].index;
                                }else{
                                    dot.original_index = dots[j].original_index;
                                }
                                
                                subShape.local_dots[ subShape.local_dots.length ] = dot;
                            }
                            // attach the subShape to the current shape
                            shape.subShapes [ shape.subShapes.length ] = subShape;
                        }

                    }else if (pre_peak.index > cur_peak.index){ // FD is btw the couple of sucessive peaks
                        let nbr_dots_btw_peaks = (len_dots-1 - pre_peak.index ) + cur_peak.index; //  ( [i] [i-1] not included )
                        if(nbr_dots_btw_peaks >= 1){
                            let subShape = {local_dots: [], peaks: [], ext_surface: 0, subShapes: []};
                            let new_index = 0;
                            for(let j=pre_peak.index; j<len_dots; j++ ){
                                let dot = {x: 0, y:0, index: 0, original_index: 0};
                                dot.x = dots[j].x;
                                dot.y = dots[j].y;
                                dot.index = new_index++; // restart the indexes from zero;
                                if(dots[j].original_index == -1){ // save the original index
                                    dot.original_index = principalShape.local_dots[j].index;
                                }else{
                                    dot.original_index = dots[j].original_index;
                                }

                                subShape.local_dots[ subShape.local_dots.length ] = dot;
                            }
                            for(let j=0; j<=cur_peak.index; j++ ){
                                let dot = {x: 0, y:0, index: 0, original_index: 0};
                                dot.x = dots[j].x;
                                dot.y = dots[j].y;
                                dot.index = new_index++; // restart the indexes from zero;
                                if(dots[j].original_index == -1){ // save the original index
                                    dot.original_index = principalShape.local_dots[j].index;
                                }else{
                                    dot.original_index = dots[j].original_index;
                                }

                                subShape.local_dots[ subShape.local_dots.length ] = dot;
                            }
                            // attach the subShape to the current shape
                            shape.subShapes [ shape.subShapes.length ] = subShape;
                        }   
                    }
                }else{   // Rotation Direction.value = " Anti-clockwise "
                    if(pre_peak.index > cur_peak.index){ // the FD is not between the couple of peaks
                        let dif_indexes = pre_peak.index - cur_peak.index;
                        if(dif_indexes >= 2){
                            let subShape = {local_dots: [], peaks: [], ext_surface: 0, subShapes: []};
                            let min_index = Math.min(cur_peak.index, pre_peak.index);
                            // add the dots btw the 2 successive peaks in the subShape local dots array
                            let new_index = 0;
                            for(let j= min_index ; j<= min_index + dif_indexes; j++){
                                let dot = {x: 0, y:0, index: 0, original_index: 0};
                                dot.x = dots[j].x;
                                dot.y = dots[j].y;
                                dot.index = new_index++; // restart the indexes from zero;
                                if(dots[j].original_index == -1){ // save the original index
                                    dot.original_index = principalShape.local_dots[j].index;
                                }else{
                                    dot.original_index = dots[j].original_index;
                                }

                                subShape.local_dots[ subShape.local_dots.length ] = dot;
                            }
                            // attach the subShape to the current shape
                            shape.subShapes [ shape.subShapes.length ] = subShape;
                        }
                    }else if(pre_peak.index < cur_peak.index){  //  FD is btw the couple of peaks
                        let nbr_dots_btw_peaks = (len_dots-1 - cur_peak.index ) + pre_peak.index; //  ( [i] [i-1] not included )
                        if(nbr_dots_btw_peaks >= 1){
                            let subShape = {local_dots: [], peaks: [], ext_surface: 0, subShapes: []};
                            // add the dots to the len local_dots array
                            let new_index = 0;
                            for(let j=cur_peak.index; j<len_dots; j++){
                                let dot = {x: 0, y:0, index: 0, original_index: 0};
                                dot.x = dots[j].x;
                                dot.y = dots[j].y;
                                dot.index = new_index++; // restart the indexes from zero;
                                if(dots[j].original_index == -1){ // save the original index
                                    dot.original_index = principalShape.local_dots[j].index;
                                }else{
                                    dot.original_index = dots[j].original_index;
                                }

                                subShape.local_dots[ subShape.local_dots.length ] = dot;
                            }
                            for(let j=0; j<=pre_peak.index; j++ ){
                                let dot = {x: 0, y:0, index: 0, original_index: 0};
                                dot.x = dots[j].x;
                                dot.y = dots[j].y;
                                dot.index = new_index++; // restart the indexes from zero;
                                if(dots[j].original_index == -1){ // save the original index
                                    dot.original_index = principalShape.local_dots[j].index;
                                }else{
                                    dot.original_index = dots[j].original_index;
                                }
                    
                                subShape.local_dots[ subShape.local_dots.length ] = dot;
                            }
                            // attach the subShape to the current shape
                            shape.subShapes [ shape.subShapes.length ] = subShape;
                        }
                    }
                }
            }
        }
    }
    // setting the attributes of principal shape : 
    set_shape(principalShape);

    // saving the initial value of external surface : 
    initial_ext_surface = principalShape.ext_surface;

    // when the principal shape is set, we'll do the same process for its children by the following "Recursive Function" :
    function get_ExtSurface(shape){
        if(shape.subShapes.length > 0){
            let subShapes_surface = 0; // to store the sum of children's surfaces
            for(let subShape of shape.subShapes){
                console.log('subShape:  ',subShape);
                set_shape(subShape);
                let surface_rectangle = (right_dot.x - left_dot.x) * (down_dot.y - up_dot.y); // edges would change by the next recursion ! that's why we have to save this surface
                get_ExtSurface(subShape); // this recursion will update external surface, before go on to the next statements.
                // If we go on, that means the current sub Shape has no child
                let sub_surface = surface_rectangle - subShape.ext_surface;   // RectangleSurface - shape.ext_surface;
                subShapes_surface += sub_surface;
                // save the surfaces of the direct children of the principal shape :
                if(shape.local_dots.length == principalShape.local_dots.length){
                    let len =  subShape_surfaces_L1.push(sub_surface); 
                }
            }
            // Now, we've got sum of all the surfaces of the Sub Shapes of the current shape, let's add it to the external surface of the current shape to have it complete, 
            shape.ext_surface += subShapes_surface;
        }
    }
    get_ExtSurface(principalShape);
    console.log(principalShape);
    console.log('The surfaces of principal shape\'direct childs: ',subShape_surfaces_L1);

    // Now allowing the process of painting of the external surface to start :
    principalShape_set = true;

    // retrive the original values of the 4 edges : to draw and paint correctly the external surface of Level 0
    up_dot = Object.assign({},global_up_dot);
    right_dot = Object.assign({},global_right_dot);
    down_dot = Object.assign({},global_down_dot);
    left_dot = Object.assign({},global_left_dot);

    // Paint the External Surface of Level 0 :
    function paint_ext_surface_L0(){
        return new Promise( (resolve,reject) => {
            setTimeout(() => {
                paint_Ext_Surface(principalShape, global_up_dot, global_right_dot, global_down_dot, global_left_dot,'rgba(0, 128, 0, 0.6)');
                resolve('done');
            }, 500);
        });
    }
    // paint the subShapes of level 1 :
    function paint_subshapes_L1(){
        return new Promise((resolve, reject) =>{
            let len = principalShape.subShapes.length;
            let t=0;
            let nbr_subShape_painted = 0;
            setTimeout( () =>{    
                if(len > 0){
                    for( let subShape of principalShape.subShapes){
                        setTimeout(()=> {
                            let local_dots = subShape.local_dots;
                            contexte.beginPath();
                            contexte.fillStyle = 'rgb(2, 80, 2)';
                            contexte.moveTo(local_dots[0].x, local_dots[0].y);
                            for(let i = 1 ; i < local_dots.length; i++ ){
                                contexte.lineTo(local_dots[i].x, local_dots[i].y);
                            }
                            contexte.lineTo(local_dots[0].x, local_dots[0].y);
                            contexte.fill();
                            nbr_subShape_painted++;
                            if(nbr_subShape_painted == len){
                                resolve('done');
                            }
                        }, t);
                        t += 500;
                    }
                }else{
                    resolve('no subshapes');
                }
            },500);
        });
    }
    // Re-set autorisation variables : so we can autorise updating the canvas by hovering the mouse over the canvas.
    function autorise_updating(){
            subShapes_painting_done = true;
            time_to_update = true;
            updateCanvas();
            //time_to_update = false; // so we can work on animations below without being interupted whith the 'mousemove' event
    }
    
    function move_ext_surface(){

        // reset coords of the external surface' dots :
        up_dot.y -= 10;
        right_dot.x += 10;
        down_dot.y += 10;
        left_dot.x -= 10;

        // stop the movement if the external surface is out of the canvas :
        if( right_dot.x >= 800 + (global_right_dot.x - global_left_dot.x) && down_dot.y >= 500 + (global_down_dot.y - global_up_dot.y) ){
            clearInterval(start_movement);
            formula.style.backgroundColor = 'white';
            const surface = document.createElement('div'); // Create an element containing the surface
            surface.innerHTML = initial_ext_surface;
            surface.style.color = 'green';
            surface.style.fontSize = 'x-large';
            formula.appendChild(surface);
        }

        for(let peak of principalShape.peaks[0]){ // up
            peak.y -= 10;
        }
        for(let peak of principalShape.peaks[1]){ //right
            peak.x += 10;
        }

        for(let peak of principalShape.peaks[2]){ // down
            peak.y += 10;
        }
        for(let peak of principalShape.peaks[3]){  // left
            peak.x -= 10;
        }
        // repaint the new position of the external surface :
        updateCanvas();
    }

    function launch_movement_L0(){
        return new Promise ((resolve, reject) =>{
            setTimeout(() => {
                start_movement = setInterval(()=>{
                    move_ext_surface();
                    let bool = right_dot.x >= 800 + (global_right_dot.x - global_left_dot.x) && down_dot.y >= 500 + (global_down_dot.y - global_up_dot.y);
                    if(bool){
                        resolve('done');
                    }
                }, 50);
            } , 800);
        });
    }

    // Start the process of painting and moving external shapes :
    let start_movement;
    async function start_process_L0(){
        let complete_1 = await paint_ext_surface_L0();
        let complete_2 = await paint_subshapes_L1();
        autorise_updating();

        // --------------- Animation of removing external surface of Level 0: ----------------------------------
        // 1- delete shared peak references from sections of peaks (up_peaks, right_peaks,...) :
        for(let section of principalShape.peaks){
            let section_len = section.length;
            for(let i=0; i<section_len; i++){
                let peak_to_remove = section[i];
                section.splice(i,1,Object.assign({}, peak_to_remove));    // delete "1" one element from the position "i", and the new object (3rd argument)     
            }
        }
        // 2- launching the animation, after painting all the sub shapes of "level 1" :
        let complete_3 = await launch_movement_L0();
        // ------------- End of animation - External Surface - Level 0 ----------------------------------------------
        let len = principalShape.subShapes.length;
        if( len > 0){
            let i = 0
                for(; i < len; i++){ 
                    let subShape = principalShape.subShapes[i];
                    // for each subShape, move it out, then add the relative surface to the formula
                    function return_promise(){
                        return new Promise((resolve) => {
                            let start_movement = setTimeout(function run(){
                                let min_x = 1000;
                                for(let dot of subShape.local_dots){
                                    dot.x += 5;
                                    // look for minimal x-coordinate
                                    if(dot.x <= min_x){ 
                                        min_x = dot.x;
                                    }
                                }
                                updateCanvas();
                                if(min_x >= 800){
                                    const op = document.createElement('div'); // Create an element containing the operator '+'
                                    op.innerHTML = '+';
                                    op.style.color = 'gray';
                                    op.style.fontSize = 'large';
                                    formula.appendChild(op);
        
                                    const surface = document.createElement('div'); // Create an element containing the surface
                                    surface.innerHTML = subShape_surfaces_L1[i];
                                    surface.style.color = 'rgb(2, 80, 2)';
                                    surface.style.fontSize = 'large';
                                    formula.appendChild(surface);
                                    clearTimeout(start_movement);
                                    resolve('done'); 
                                }else{
                                    start_movement = setTimeout(run, 10);
                                }
                            }, 10);
                        });
                    }
                    let response = await return_promise();
                }
        }
        setTimeout(() => alert('process complete'),500);
        setTimeout( () =>{
            let surface_rectangle = (global_down_dot.y - global_up_dot.y) * (global_right_dot.x - global_left_dot.x);
            surface.value = surface_rectangle - principalShape.ext_surface;
        }
            
        ,700);

        
            
    }
    start_process_L0();
}
