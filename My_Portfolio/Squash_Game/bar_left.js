// Move the bar to the left
function left(){
    if (pb>0){
        contexte.clearRect(X_Range[pb--],280,150,15);
        
        contexte.fillStyle = 'pink';     
        contexte.fillRect(X_Range[pb],280,150,15); // edges : Xstart=5px   Xend=445px;
    }
}