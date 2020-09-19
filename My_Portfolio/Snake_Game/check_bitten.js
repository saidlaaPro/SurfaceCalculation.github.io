function error_msg(){
    alert('Game Over. The Snake Has Bitten Itself !');
}
function check_bitten(){
    let l=a.length;
    let i=0;
    for(;i<l-3;i++){ // a snake whose length is 4 can't bite itself, that's what (i<l-2).
        if(a[l-1]==a[i] && b[l-1]==b[i]){
            clearInterval(start_off);
            setTimeout(error_msg,10);
            break;   
        }
    }
}