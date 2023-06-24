export const validate = (command, args) => {
  switch (command) {
    case '.exit': 
    case 'up':
    case 'ls':    
      if(args.length === 0) {
        return true;
      }    

    case 'cat':
    case 'add':
    case 'rm':
    case 'hash':
    case 'cd':
    case 'os':  
      if(args.length === 1) {
        return true;
      }  
    
    case 'rn':
    case 'cp':
    case 'mv':
    case 'compess':
    case 'decompess':         
      if(args.length === 2) {
        return true;
      } 
    
    default:
      return false;  
  }
}
