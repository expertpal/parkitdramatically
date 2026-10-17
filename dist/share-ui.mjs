function pngBlob(data){
 const bytes=atob(data.slice(data.indexOf(',')+1)),out=new Uint8Array(bytes.length);
 for(let i=0;i<bytes.length;i++)out[i]=bytes.charCodeAt(i);
 return new Blob([out],{type:'image/png'});
}
// Encoding stays in the original click: download-only browsers do not lose the gesture.
// The download uses a PNG data URL, so closing the preview cannot revoke an active download.
export function bindShareDialog({dialog,preview,status,download,fullSize,native,close,buttons,makeImage,onOpen}){
 let url=null,file=null,generation=0;
 function release(){
  generation++;if(url){const old=url;setTimeout(()=>URL.revokeObjectURL(old),60000);}url=null;file=null;
  preview.removeAttribute('src');download.removeAttribute('href');fullSize.removeAttribute('href');
  download.setAttribute('aria-disabled','true');native.hidden=true;native.disabled=false;
 }
 dialog.addEventListener('close',release);close.onclick=()=>dialog.close();
 download.onclick=()=>{status.textContent='Download requested. If nothing saves, open the full-size image and save it there.';};
 function open(){
  release();status.textContent='Preparing your parking evidence…';preview.hidden=download.hidden=fullSize.hidden=native.hidden=true;
  onOpen();dialog.showModal();
  try{
   const {canvas,plan}=makeImage(),data=canvas.toDataURL('image/png');
   if(!data.startsWith('data:image/png;base64,'))throw new Error('PNG encoding failed');
   const blob=pngBlob(data);url=URL.createObjectURL(blob);
   if(typeof File==='function')file=new File([blob],plan.filename,{type:'image/png'});
   preview.src=url;preview.alt=plan.title+'. '+plan.caption;preview.hidden=false;
   download.href=data;download.download=plan.filename;download.hidden=false;download.removeAttribute('aria-disabled');
   fullSize.href=url;fullSize.hidden=false;
   try{native.hidden=!(file&&navigator.canShare?.({files:[file]})&&navigator.share);}catch{native.hidden=true;}
   if(native.hidden)download.click();
   else status.textContent=plan.classified?'Destination classified. Share the image or download your PNG.':'Choose Share image or Download PNG below.';
  }catch{status.textContent='Could not create the image. Close this window and try again.';}
 }
 native.onclick=async()=>{if(!file)return;const token=generation;native.disabled=true;try{await navigator.share({files:[file],title:'Park It. Dramatically.'});if(token===generation)status.textContent='Shared. Your reputation is in their hands.';}catch(e){if(token===generation&&e.name!=='AbortError')status.textContent='Sharing is unavailable here. Download the PNG instead.';}finally{if(token===generation)native.disabled=false;}};
 buttons.forEach(b=>b.onclick=open);
 return {close:()=>{if(dialog.open)dialog.close();release();}};
}
