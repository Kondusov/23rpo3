function random(i){
    console.log(Math.floor(Math.random()*(i-0)+1));
    if(i<=0){
        return i;
    }
    else{
        random(i-1);
    }
}
random(3);