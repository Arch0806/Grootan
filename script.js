let jsoninput = document.querySelector("#textbox");
let errorMsg = document.querySelector('#json-error');
function handlesubmit(){
    const jsonstring = jsoninput.value;
    try{
        const json = JSON.parse(jsonstring); 
        const classstring = createPojoClass(json);   
        console.log(classstring);
        let blob = new Blob([classstring],{type:'text/plain'});
        let file = new File([blob],"Pojo.java",{type:"text/plain"});
        let a = document.createElement('a');
        document.body.appendChild(a);
        a.download = "YourPojo.java";
        a.href = URL.createObjectURL(blob);
        a.click();
        document.body.removeChild(a);
    }catch(err){
        console.log(err);
    }
}
function createPojoClass(json){
    let myclass = new PojoCreator();
    Object.keys(json).map(key=>{
        let value = json[key];
        console.log(typeof value);
        let type = "String";
        if(typeof value === "object"){
            type = "List<"+getType(value[0])+">";
        }else type = getType(value[0]);
        console.log(type);
        myclass.createVariable(key,type);
    });
    myclass.closeClassString();
    return myclass.getClassString();
}
class PojoCreator{
    classstring;
    constructor(){
        this.classstring = "";
        this.classstring += "import java.util.*;\n";
        this.classstring += "public class YourPojoClass{";
    }
    closeClassString(){
        this.classstring =  '\n'+this.classstring+'}';
    }
    createVariable(name,type){
        this.classstring += `\nprivate ${type} name;`
        this.createSetter(name,type);
        this.createGetter(name,type);
    }
    createSetter(name,type){
        let funcstring = `\n\tpublic void set${name}(${type} ${name}){
            \n\t\tthis.${name} = ${name};
        \t}\n`;
        this.classstring += funcstring;
    }
    createGetter(name,type){
        let funcstring = `\n\tpublic ${type} get${name}(){
            \n\t\treturn this.${name};
        \n\t}`;
        this.classstring += funcstring;
    }
    getClassString(){
        return this.classstring;
    }
}

function getType(value){
        try{
            let num = parseFloat(value);
            let tryNum = parseInt(value);
            console.log(num,tryNum);
            if(isNan(num))return "String";
            if(num === tryNum)return "int";
            return "double";
        }catch(err){
            return "String";
        }
    
}