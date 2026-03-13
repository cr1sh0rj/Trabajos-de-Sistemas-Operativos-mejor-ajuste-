// Default memory blocks
let algorithm = "best";
document.addEventListener("DOMContentLoaded", () => {

    const radios = document.querySelectorAll('input[name="algorithm"]');

    radios.forEach(radio => {
        radio.addEventListener("change", (e)=>{
            algorithm = e.target.value;
        });
    });

});

let memoryBlocks = [
    {size:100, used:false, process:null},
    {size:500, used:false, process:null},
    {size:200, used:false, process:null},
    {size:300, used:false, process:null},
    {size:600, used:false, process:null},
    {size:1200, used:false, process:null}
];

/* Process queue */
let processes = [];

function renderHTML(){
    const memory = document.getElementById("memory");
    const queue = document.getElementById("queue");

    memory.innerHTML = "";
    queue.innerHTML="";

    // Blocks rendering
    memoryBlocks.forEach((block,index)=>{

        const row = document.createElement("div"); 
        row.classList.add("memory-row");

        const fragElement = document.createElement("div");
        fragElement.classList.add("fragment");
        
        const fragText = document.createElement("div");
        fragText.classList.add("frag-text");

        if(block.used){
            row.classList.add("used");

            let frag = block.size - block.process.size;
            
            row.appendChild(fragElement);

            fragText.innerHTML = ` ${block.process.name} (${block.process.size}) Fragmentación: ${frag} `;
            
            fragElement.appendChild(fragText);

            // Delete button
            const deleteBtn = document.createElement("button");
            deleteBtn.innerText = "Eliminar";
            deleteBtn.classList.add("delete-btn");
            deleteBtn.onclick = () => removeProcess(index);

            fragElement.appendChild(deleteBtn);

            // Dynamic height based on fragmentation percentage
            // fragElement.style.height = (frag / block.size) * 100 + "%";
        
        } else {
            fragText.innerHTML = "Disponible: " + block.size;

            row.appendChild(fragElement);
            fragElement.appendChild(fragText);

        }
        
        // Set height based on block size (for better visualization)
        let height =
            block.size > 600 ? 350 :
            block.size > 400 ? block.size / 2 :
            block.size;

        fragElement.style.height = height + "px";

        fragElement.style.height = height + "px";
    	
    
        memory.appendChild(row);
    });

    processes.forEach(p => {
        const process = document.createElement("div");
        process.classList.add("process");
        process.innerHTML = p.name + " (" + p.size + ")";
        queue.appendChild(process);
    });
}

// TO DO: Verify user don't enter negative numbers
function addProcess(){

    const name = document.getElementById("process-name").value.trim();
    const size = parseInt(document.getElementById("process-size").value);

    // Validación nombre
    if(!name){
        alert("Ingrese un nombre de proceso");
        return;
    }

    // Validación tamaño
    if(isNaN(size) || size <= 0){
        alert("El tamaño del proceso debe ser un número mayor que 0");
        return;
    }

    processes.push({name, size});

    document.getElementById("process-name").value="";
    document.getElementById("process-size").value="";

    autoAllocate();
}

function autoAllocate(){

    processes = processes.filter(process => {

        let selectedIndex = -1;

        if(algorithm === "best"){

            let minDiff = Infinity;

            memoryBlocks.forEach((block,index)=>{
                if(!block.used && block.size >= process.size){

                    let diff = block.size - process.size;

                    if(diff < minDiff){
                        minDiff = diff;
                        selectedIndex = index;
                    }

                }
            });

        }

        if(algorithm === "first"){

            for(let i=0;i<memoryBlocks.length;i++){

                let block = memoryBlocks[i];

                if(!block.used && block.size >= process.size){
                    selectedIndex = i;
                    break;
                }

            }

        }

        if(selectedIndex !== -1){

            memoryBlocks[selectedIndex].used = true;
            memoryBlocks[selectedIndex].process = process;

            return false;
        }

        return true;

    });

    renderHTML();
}

function removeProcess(index){
    memoryBlocks[index].used = false;
    memoryBlocks[index].process = null;
    autoAllocate();
}

renderHTML();