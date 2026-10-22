/* Shared DOM/Canvas geometry. Source pixels keep their aspect ratio; the face is the anchor. */
(function(root){
  root.MotionGitPresenterFraming=function(sw,sh,W,H,face,{round=false,reliable=true}={}){
    if(![sw,sh,W,H].every(v=>Number.isFinite(v)&&v>0))throw Error('Invalid presenter dimensions');
    const clamp=(v,a,b)=>Math.max(a,Math.min(b,v)),cover=Math.max(W/sw,H/sh);
    let scale=cover,cx=.5,cy=.5;
    if(reliable&&face&&['cx','cy','h'].every(k=>Number.isFinite(face[k])&&face[k]>0&&face[k]<=1)){
      cx=face.cx;cy=face.cy;
      // Smallest uniform zoom that can put the face in the middle without exposing an edge.
      const centered=Math.max(W/(2*cx*sw),W/(2*(1-cx)*sw),H/(2*cy*sh),H/(2*(1-cy)*sh));
      const comfortable=H*(.36+.10*clamp(Number(round),0,1))/(face.h*sh);
      scale=Math.min(Math.max(cover,centered,comfortable),cover*2.5);
      // A large or edge-adjacent face must not be zoomed through the forehead/chin.
      const headLimit=H*.76/(face.h*sh);
      scale=Math.max(cover,Math.min(scale,headLimit));
    }
    const width=sw*scale,height=sh*scale;
    const x=clamp(W/2-cx*width,W-width,0),y=clamp(H/2-cy*height,H-height,0);
    return {x,y,width,height,scale,faceCenter:{x:(x+cx*width)/W,y:(y+cy*height)/H}};
  };
})(globalThis);
