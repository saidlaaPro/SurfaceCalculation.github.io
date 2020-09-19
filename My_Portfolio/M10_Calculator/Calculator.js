
var keyboard_wrapper = document.querySelectorAll(".keyboard_wrapper div");
var figures_operators = document.querySelectorAll('.figure, .math_operator');
var math_expression = document.querySelector('.math_expression');
var err_msg = document.querySelector('.err_msg');
var text_zone = document.querySelector('.text_zone'); // the first text_element
var text_elements = [text_zone];
var cursor = document.querySelector('.cursor');
var clear = document.querySelector('.clear');
var percent = document.querySelector('.keyboard_wrapper').childNodes[5];
var screen_wrapper = document.querySelector('.screen_wrapper');
var equal = document.querySelector('.equal');
var figure_count = 0;
var last_result = 0 ;
var screen_result = document.querySelector('.result');
var current_segment = 0; // result = seg1 + seg2+...    [seg1 = number1 *(/)number2*... ]
var sub_segment = 0; // seg1 = sub_seg1 * this.num;
var segment_sign = '+';

function changeStyle(){
   this.style.fontSize = "20px";
   setTimeout(() => {
      this.style.fontSize = "30px";
      if(this.innerHTML=='÷'){
         this.style.fontSize = "40px";
      }
},150);
}
// Styles for the event of clicking on the buttons
for(const item of keyboard_wrapper){
   item.addEventListener('mousedown',changeStyle);
}

let operators=['+','–','x','÷','=','%'];

function write(){
   if(figure_count<15){
      //(Condition) => do not show the elements of the operators array when the screen is empty.
      if (!(text_elements[0].innerHTML=='' && operators.indexOf(this.innerHTML)!=-1)){
         let last_index = text_elements.length - 1;
         if( operators.indexOf(this.innerHTML)!=-1 ){ // if an operator is typed.
            // change the color of the first number if it's green
            if(screen_result.style.color == 'rgb(62, 238, 62)'){
               text_zone.style.color = 'white';
               screen_result.style.color = '#888';
               screen_result.innerHTML = '';
               screen_result.style.bottom = '15px';
               screen_result.style.left = '5px';
            }

            if( operators.indexOf(text_elements[last_index].innerHTML) == -1 ){ // if we don't have two sucessive operators
               const op = document.createElement('div'); // Create an element containing the operator symbol
               op.innerHTML = this.innerHTML;
               math_expression.insertBefore(op,cursor);

               op.style.color = 'rgb(62, 238, 62)';
               op.className = 'math_operator';
               op.style.position = 'relative';
               op.style.fontSize = '30px';
               op.style.marginLeft = '3px';
               op.style.marginRight = '3px';
               op.style.lineHeight = '40px';
               
               last_index++;
               text_elements[last_index] = op;
            }else{ // in case we have two successive operators
               text_elements[last_index].innerHTML = this.innerHTML;
            }
            // fixing a style issue (regarding the Hyphen '-');
            if(['x','–'].indexOf(this.innerHTML) != -1){
               text_elements[last_index].style.bottom = '2px';
            }
            // keep the value of expression before the sign 'x' or '/'
            if (['x','÷'].indexOf(this.innerHTML)!= -1){
               sub_segment = current_segment;
            }

            // reset the digit count.
            figure_count = 0;
            
         }else{ // if a digit is typped
            if (text_elements[last_index].className === 'math_operator'){ // if the last caracter entered is math_operator then create a new div for the next number
               const num = document.createElement('div'); // Create an element containing the number 
               num.innerHTML=this.innerHTML;
               num.style.color = 'white';
               math_expression.insertBefore(num,cursor);
               last_index++;
               text_elements[last_index] = num;
               let last_sign = text_elements[last_index-1].innerHTML;
               
               if( ['x','÷'].indexOf(last_sign)!= -1 ){
                  switch(last_sign){
                     case 'x': current_segment = sub_segment * parseInt(num.innerHTML); break;
                     case '÷': current_segment = sub_segment / parseInt(num.innerHTML); break;
                  }
               }
            
               if(['+','–'].indexOf(last_sign)!= -1){
                  switch(segment_sign){
                     case '+': last_result += Math.abs(current_segment);        break;
                     case '–': last_result += (-1) * Math.abs(current_segment); break; 
                  }
                  current_segment = parseInt(num.innerHTML);
                  segment_sign = last_sign;
               }

            }else{ // if the last caracter entered is a digit then concatenate the digit to the current number
               // Don't concatenate if the number shown in the math_expression screen is green (math_result) 
               if(screen_result.style.color != 'rgb(62, 238, 62)'){
                  text_zone.style.color = 'white';
                  text_elements[last_index].innerHTML += this.innerHTML;
                  
                  if(last_index == 0){
                     current_segment = parseInt(text_elements[last_index].innerHTML);  
                  }else{
                     switch(text_elements[last_index-1].innerHTML){
                        case 'x': current_segment  = sub_segment * parseInt(text_elements[last_index].innerHTML); break;
                        case '÷': current_segment  = sub_segment / parseInt(text_elements[last_index].innerHTML); break;
                        case '+': current_segment  = parseInt(text_elements[last_index].innerHTML); break;
                        case '–': current_segment  = parseInt(text_elements[last_index].innerHTML); break;
                     }
                  }
               }else{ // typing a figure while the math_expression screen shows the final result.
                  text_zone.innerHTML = '';
                  screen_result.innerHTML='';
                  screen_result.style.color = '#888';
                  screen_result.style.bottom = '15px';
                  screen_result.style.left = '5px';
                  figure_count = 0;
               }    
            }
            
            figure_count++;

         }
      }
   }else{
      // When the number of digits in a single number exceeds 15 :
      let non_digits = ['+','–','x','÷'];
      if( non_digits.indexOf(this.innerHTML)!= -1 ){ // a non-digit entered
         figure_count = 0;
         err_msg.innerHTML = '';
      }else{
         err_msg.textContent = 'the number can\'t have more than 15 digit !';
      }
      
   }
   // Show the math result in the screen when we have a complete math expression. (a + b) or (a x b)
   if ( text_elements.length > 2 ){
      switch(segment_sign){
         case '+': screen_result.innerHTML = last_result + Math.abs(current_segment); break;
         case '–': screen_result.innerHTML = last_result - Math.abs(current_segment); break;
      }
   }
}
// writing in the screen
for(const item of figures_operators){
   item.addEventListener('mouseup',write);
}

// Creating a cursor
function blink(){
   let height = cursor.style.height;
   if(height != '0px' ){
      cursor.style.height='0px';
   }else{
      cursor.style.height='35px';
   }
   
}
let cursor_timer = setInterval(blink,500);

// Clearing the screen:
clear.addEventListener('click', () => {
   // remove all the text_items of the screen from the DOM, except for the first one.
   for(let i=1; i< text_elements.length;i++){
      math_expression.removeChild(text_elements[i--]);
      text_elements.splice(1,1);
   }
   //clearing the math expression in the screen!
   text_zone.innerHTML='';

   err_msg.textContent = '';
   screen_result.innerHTML='';
   last_result = 0;
   current_segment = 0;
   figure_count=0;
   // setting the default sign :
   segment_sign = '+';
   if ( screen_result.style.color == 'rgb(62, 238, 62)' ){
      text_zone.style.color = 'white';
      screen_result.style.color = '#888';
      screen_result.style.bottom = '15px';
      screen_result.style.left = '5px';
   }
});

// Action for "%" button :
percent.addEventListener('click', () => {
   /*
   let last_index = text_elements.length - 1;
   if(text_zone.innerHTML != '' && last_index % 2 == 0){
      text_elements[last_index].innerHTML/=100;
      sub_segment = parseInt(text_elements[last_index].innerHTML);
   }
   */
});

// Action for " = " button
function show_result(){
   //remove all the HTML elements from the math_expression in the screen
   for(let i=1; i< text_elements.length;i++){
      math_expression.removeChild(text_elements[i--]); // (--) this is for keeping the index i = 1;
      text_elements.splice(1,1); // delete an element (2nd argument) from the index 1 (1st argument);
   }

   text_zone.style.color = '#353535';
   text_zone.innerHTML = screen_result.innerHTML;

   screen_result.style.color = 'rgb(62, 238, 62)';
   let ht = screen_wrapper.clientHeight-screen_result.clientHeight-15;
   screen_result.style.bottom = ht+'px'; // release the last value of this property.
   console.log(screen_result.clientWidth);
   let wdt = screen_wrapper.clientWidth - 2 - screen_result.clientWidth;
   screen_result.style.left = wdt+'px';
   // clear the variables used for calculation :
   last_result = 0;
   sub_segment = 0;
   current_segment = parseInt(screen_result.innerHTML);
   if(current_segment<0){
      segment_sign = '–';
   }else{
      segment_sign = '+';
   }
}
equal.addEventListener('click',show_result);