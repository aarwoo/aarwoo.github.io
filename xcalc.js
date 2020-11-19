const no_find=-1;
const err_expr=-2;
const min_lev=0;
const max_lev=Math.pow(2,64);
const ftable={"":(x)=>(x),
              "sin":Math.sin,
              "cos":Math.cos,
              "tan":Math.tan,
              "arcsin":Math.asin,
              "arccos":Math.acos,
              "arctan":Math.atan,
              "abs":Math.abs,
              "sqrt":Math.sqrt,
              "ln":Math.log,
              "exp":Math.exp};
function find_op(expr,op){
       let lev=min_lev;
       for(let i=0;i<expr.length;i=i+1){
              if(expr[i]=="("){
                      lev=lev+1;
                      if(lev>max_lev){
                           return err_expr;
                      }else{
                           /*PASS*/
                      }
               }else if(expr[i]==")"){
                      lev=lev-1;
                      if(lev<min_lev){
                           return err_expr;
                      }else{
                           /*PASS*/
                      }
               }else if(expr[i]==op&&lev==0){
                      if((op=="+"||op=="-")&&expr[i-1]=="e"&&"0"<=expr[i-2]&&expr[i-2]<="9"){
                          /*PASS*/
                      }else{
                          return i;
                      }
               }else{
                      /*PASS*/
               }
        }
        return no_find;
}
function select_ret(x,y){
        if(x>=0&&y>=0){
              return Math.min(x,y);
        }else if(x<0&&y<0){
              return Math.min(x,y);
        }else{
             return Math.max(x,y);
       }
}
function split_expr(expr,pos){
        return {lexpr:expr.substr(0,pos),
                op:expr[pos],
                rexpr:expr.substr(pos+1)};
}
export function xcalc(expr,xval){
        if(expr!=""){
               let p=select_ret(find_op(expr,"+"),find_op(expr,"-"));
               if(p==err_expr){
                     return Number.NaN;
               }else if(p!=no_find){
                      let a=split_expr(expr,p);
                      if(a.op=="+"){
                             a.lexpr=(a.lexpr=="")?("0"):(a.lexpr);
                             return xcalc(a.lexpr,xval)+xcalc(a.rexpr,xval);
                      }else if(a.op=="-"){
                             a.lexpr=(a.lexpr=="")?("0"):(a.lexpr);
                             return xcalc(a.lexpr,xval)-xcalc(a.rexpr,xval);
                      }else{
                             /*PASS*/
                      }
               }else{
                     /*PASS*/
               }
               p=select_ret(find_op(expr,"*"),find_op(expr,"/"));
               if(p==err_expr){
                     return Number.NaN;
              }else if(p!=no_find){
                      let a=split_expr(expr,p);
                      if(a.op=="*"){
                             return xcalc(a.lexpr,xval)*xcalc(a.rexpr,xval);
                      }else if(a.op=="/"){
                            return xcalc(a.lexpr,xval)/xcalc(a.rexpr,xval);
                      }else{
                            /*PASS*/
                      }
              }else{
                     /*PASS*/
               }
               p=find_op(expr,"^");
               if(p==err_expr){
                     return Number.NaN;
               }else if(p!=no_find){
                      let a=split_expr(expr,p);
                      if(a.op=="^"){
                             return Math.pow(xcalc(a.lexpr,xval),xcalc(a.rexpr,xval));
                      }else{
                             /*PASS*/
                      }
              }else{
                     /*PASS*/
               }
               if(expr=="x"){
                     return xval;
               }else if("0"<=expr[0]&&expr[0]<="9"){
                     let val="";
                     let allow_dot=true;
                     let allow_e=true;
                     let allow_sgn=false;
                     for(let c of expr){
                        val=val+c;
                        if("0"<=c<="9"){
                            allow_sgn=false;
                        }else if(c=="."&&allow_dot==true){
                            allow_dot=false;
                        }else if(c=="e"&&allow_e==true){
                            allow_dot=false;
                            allow_e=false;
                            allow_sgn=true;
                        }else if((c=="+"||c=="-")&&allow_sgn=true){
                            allow_sgn=false;
                        }else{
                            val="";
                            break;
                        }
                     }
                     return Number.parseFloat(val);
               }else{
                     let s=expr.indexOf("(");
                     let e=expr.lastindexOf(")");
                     if(s==no_find||e!=expr.length-1){
                         return Number.NaN;
                     }else{
                         let f=ftable[expr.substr(0,s)];
                         if(typeof(f)=="function"){
                              return f(xcalc(expr.substr(s+1,e-s-1),xval));
                         }else{
                              return Number.NaN;
                         }
                     }
                }
        }else{
            return Number.NaN;
        }
}
