function recursive(i){
    console.log(i);
    if(i==0){
        console.log(i+ "это последняя итерация");
        return i;
    }
    else{
        recursive(i-1);
    }
}
recursive(prompt());