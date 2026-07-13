/* ============================================================
   SDRRS — chatbot.js
   A lightweight rule-based first aid assistant (keyword matching).
   No external API required — swap in a real AI API call here if
   you want live model responses (see anthropic_api notes in docs).
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  const messages = document.getElementById('chatMessages');
  const input = document.getElementById('chatInput');
  const sendBtn = document.getElementById('chatSend');

  const FAQ = [
    {
      keys: ['cpr', 'not breathing', 'no pulse', 'cardiac'],
      a: "CPR basics: 1) Call emergency services or ask someone else to. 2) Lay the person flat on their back on a firm surface. 3) Place both hands centre of the chest, interlock fingers. 4) Push hard and fast — about 2 inches deep, 100–120 compressions per minute. 5) Continue until help arrives or the person responds. If trained, give 2 rescue breaths after every 30 compressions."
    },
    {
      keys: ['bleeding', 'blood', 'cut', 'wound'],
      a: "For severe bleeding: 1) Call for emergency help. 2) Apply firm, direct pressure to the wound with a clean cloth or bandage. 3) Keep pressing without lifting to check — add more layers if it soaks through. 4) Raise the injured area above heart level if possible. 5) Keep the person still and warm until help arrives."
    },
    {
      keys: ['burn', 'scald', 'fire injury'],
      a: "For burns: 1) Move away from the heat source. 2) Cool the burn under cool (not icy) running water for 10–20 minutes. 3) Remove nearby jewellery or tight clothing before swelling starts. 4) Cover loosely with clean, non-fluffy material — don't use ice, butter, or ointments. 5) Seek medical help for burns larger than a hand, on the face, or that look deep."
    },
    {
      keys: ['choking', 'choke', 'can\'t breathe', 'stuck throat'],
      a: "For choking in a conscious adult: 1) Ask 'Are you choking?' — if they can't speak or cough, act fast. 2) Give 5 sharp back blows between the shoulder blades. 3) If that doesn't work, give 5 abdominal thrusts (Heimlich manoeuvre). 4) Alternate back blows and thrusts until the object clears or they become unresponsive — then start CPR and call for help."
    },
    {
      keys: ['fracture', 'broken bone', 'broken arm', 'broken leg', 'sprain'],
      a: "For a suspected fracture: 1) Keep the person still — don't try to straighten the limb. 2) Support the area above and below the injury to stop movement. 3) Apply a cold pack wrapped in cloth to reduce swelling. 4) Immobilise with a splint or sling only if trained, or wait for help. 5) Treat for shock if the person feels faint or cold."
    },
    {
      keys: ['flood', 'flooding', 'rising water'],
      a: "During a flood: 1) Move to higher ground immediately — don't wait. 2) Avoid walking or driving through moving water, even shallow. 3) Turn off electricity at the mains if it's safe to reach. 4) Keep away from downed power lines. 5) Use the SOS button on this app to request rescue if you're trapped."
    },
    {
      keys: ['earthquake', 'quake', 'shaking'],
      a: "During an earthquake: 1) Drop, Cover, and Hold On — get under sturdy furniture. 2) Stay away from windows, mirrors, and heavy furniture that could fall. 3) If outdoors, move to an open area away from buildings and power lines. 4) After shaking stops, check for injuries and hazards like gas leaks before moving. 5) Expect aftershocks."
    },
    {
      keys: ['house fire', 'building fire', 'smoke', 'fire safety'],
      a: "In a fire: 1) Get out immediately — don't stop to collect belongings. 2) Stay low under smoke where the air is clearer. 3) Feel doors before opening — if hot, use another exit. 4) Once out, stay out and call the fire service. 5) If trapped, seal gaps under doors and signal for help from a window."
    },
    {
      keys: ['shock', 'pale', 'dizzy', 'faint'],
      a: "For shock (pale, cold, clammy skin, rapid breathing): 1) Lay the person down and raise their legs slightly, unless injured. 2) Keep them warm with a blanket or clothing. 3) Loosen tight clothing. 4) Don't give food or drink. 5) Monitor breathing and call for emergency help."
    },
    {
      keys: ['snake', 'bite', 'venom'],
      a: "For a snake bite: 1) Keep the person calm and still to slow venom spread. 2) Keep the bitten limb below heart level. 3) Remove tight clothing or jewellery near the bite. 4) Don't cut the wound, apply ice, or try to suck out venom. 5) Get to a medical facility as quickly as possible."
    }
  ];

  function findAnswer(text){
    const lower = text.toLowerCase();
    for (const item of FAQ){
      if (item.keys.some(k => lower.includes(k))){
        return item.a;
      }
    }
    return "I don't have a specific tip for that yet. For anything serious, please call your local emergency number or use the SOS button on this site to request rescue. You can also try asking about CPR, bleeding, burns, choking, fractures, floods, earthquakes, fire safety, shock, or bites.";
  }

  function addMessage(text, who){
    const div = document.createElement('div');
    div.className = 'msg ' + who;
    div.textContent = text;
    messages.appendChild(div);
    messages.scrollTop = messages.scrollHeight;
  }

  function botReply(question){
    const typing = document.createElement('div');
    typing.className = 'msg bot';
    typing.innerHTML = '<span class="typing-dots"><span></span><span></span><span></span></span>';
    messages.appendChild(typing);
    messages.scrollTop = messages.scrollHeight;

    setTimeout(() => {
      typing.remove();
      addMessage(findAnswer(question), 'bot');
    }, 650 + Math.random()*400);
  }

  function handleSend(){
    const text = input.value.trim();
    if (!text) return;
    addMessage(text, 'user');
    input.value = '';
    botReply(text);
  }

  sendBtn.addEventListener('click', handleSend);
  input.addEventListener('keydown', (e) => { if (e.key === 'Enter') handleSend(); });

  document.querySelectorAll('.suggest-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const q = btn.dataset.q;
      addMessage(q, 'user');
      botReply(q);
    });
  });
});