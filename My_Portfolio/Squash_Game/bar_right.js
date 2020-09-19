// Move the bar to the right
function right(){
    let l=X_Range.length;
    if (pb<l-2){
        contexte.clearRect(X_Range[pb++],280,150,15);
        
        contexte.fillStyle = 'pink';     
        contexte.fillRect(X_Range[pb],280,150,15); // edges : Xstart=5px   Xend=445px;
    }
}