// client-side logic
function createChildForm(index){
  const wrap = document.createElement('div');
  wrap.className = 'child-card';
  wrap.innerHTML = `
    <h4>Child ${index+1}</h4>
    <label>Child name <input name="child_${index}_name" required></label>
    <label>Age <input name="child_${index}_age" type="number" min="0" required></label>
    <label>Gender <select name="child_${index}_gender"><option>male</option><option>female</option></select></label>
    <label>Education <input name="child_${index}_education"></label>
    <label>Now doing <select name="child_${index}_now"><option>studying</option><option>job</option><option>free</option><option>part-time job</option></select></label>
  `;
  return wrap;
}

document.addEventListener('DOMContentLoaded', ()=>{
  const childCount = document.getElementById('childCount');
  const childrenContainer = document.getElementById('childrenContainer');
  const form = document.getElementById('regForm');
  const feedback = document.getElementById('feedback');

  function renderChildren(){
    const n = parseInt(childCount.value,10);
    childrenContainer.innerHTML='';
    for(let i=0;i<n;i++) childrenContainer.appendChild(createChildForm(i));
  }

  childCount.addEventListener('change', renderChildren);
  renderChildren();

  form.addEventListener('submit', async (e)=>{
    e.preventDefault();
    feedback.textContent='Submitting...';

    const formData = new FormData(form);
    const data = {
      name: formData.get('name')||'',
      phone: formData.get('phone')||'',
      address: formData.get('address')||'',
      children: []
    };
    const n = parseInt(formData.get('childCount')||0,10);
    for(let i=0;i<n;i++){
      data.children.push({
        name: formData.get(`child_${i}_name`)||'',
        age: formData.get(`child_${i}_age`)||'',
        gender: formData.get(`child_${i}_gender`)||'',
        education: formData.get(`child_${i}_education`)||'',
        now: formData.get(`child_${i}_now`)||''
      });
    }
    data.createdAt = new Date().toISOString();

    try{
      const res = await fetch('/api/submit',{
        method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(data)
      });
      const json = await res.json();
      if(res.ok){
        feedback.textContent = 'Saved — thank you!';
        form.reset();
        renderChildren();
      } else {
        feedback.textContent = 'Error: ' + (json.message || res.statusText);
      }
    }catch(err){
      feedback.textContent = 'Network error: ' + err.message;
    }
    setTimeout(()=>feedback.textContent='',4000);
  });
});
