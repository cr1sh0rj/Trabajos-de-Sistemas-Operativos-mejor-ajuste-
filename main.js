let memoryBlocks = [
    {size:100, used:false, process:null},
    {size:500, used:false, process:null},
    {size:200, used:false, process:null},
    {size:300, used:false, process:null},
    {size:600, used:false, process:null}
];

let processes = [];

function render(){
    const memoryDiv = document.getElementById("memory");
    const queueDiv = document.getElementById("queue");

    memoryDiv.innerHTML = "";
    queueDiv.innerHTML="";

    memoryBlocks.forEach((block,index)=>{

        const row = document.createElement("div"); 
        row.classList.add("memory-row"); 
        // Clase memory-row no se está usando en el css

        const div = document.createElement("div");
        div.classList.add("block");

        if(block.used){
            div.classList.add("used");

            let frag = block.size - block.process.size;

            div.innerHTML = ` ${block.process.name} (${block.process.size}) <br>Fragmentación: ${frag} `;

            if(frag > 0){
                const fragDiv = document.createElement("div");
                fragDiv.classList.add("fragment");
                
                fragDiv.style.height = (frag/block.size) * 100 + "%";
                div.appendChild(fragDiv);
            }

        } else {
            div.innerHTML = "Libre: " + block.size;
        }

        div.style.height = block.size/3 + "px"; // CSS Height
        row.appendChild(div);

        if(block.used){
                const btn = document.createElement("button");
                btn.innerText = "Eliminar";
            btn.classList.add("delete-btn");
                btn.onclick = () => removeProcess(index);

                row.appendChild(btn);
	}

	memoryDiv.appendChild(row);
    });

    processes.forEach(p=>{
        const div = document.createElement("div");
        div.classList.add("process");
        div.innerHTML = p.name + " (" + p.size + ")";
        queueDiv.appendChild(div);
    });
}

function addProcess(){
    const name = document.getElementById("pname").value;
    const size = parseInt(document.getElementById("psize").value);

    if(!name || !size) return;

    processes.push({name, size});
    document.getElementById("pname").value="";
    document.getElementById("psize").value="";

    autoAllocate();
}

function autoAllocate(){
    processes = processes.filter(process => {

        let bestIndex = -1;
        let minDiff = Infinity;

        memoryBlocks.forEach((block,index)=>{
            if(!block.used && block.size >= process.size){
                let diff = block.size - process.size;
                if(diff < minDiff){
                    minDiff = diff;
                    bestIndex = index;
                }
            }
        });

        if(bestIndex !== -1){
            memoryBlocks[bestIndex].used = true;
            memoryBlocks[bestIndex].process = process;
            return false;
        }

        return true;
    });

    render();
}

function removeProcess(index){
    memoryBlocks[index].used = false;
    memoryBlocks[index].process = null;
    autoAllocate();
}

render();