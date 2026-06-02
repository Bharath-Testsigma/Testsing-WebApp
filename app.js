/* ---- Lumen demo store: shared logic ---- */

const PRODUCTS = [
  { id:1, name:"Soft Glow Lamp",   cat:"Home",    price:48.00, emoji:"💡", bg:"linear-gradient(135deg,#ff7a59,#ffb37a)", tag:"New" },
  { id:2, name:"Wireless Buds",    cat:"Tech",    price:79.00, emoji:"🎧", bg:"linear-gradient(135deg,#5b8def,#7ec8ff)" },
  { id:3, name:"Knit Beanie",      cat:"Wear",    price:24.00, emoji:"🧢", bg:"linear-gradient(135deg,#7a5bff,#b07aff)" },
  { id:4, name:"Ceramic Mug",      cat:"Kitchen", price:18.00, emoji:"☕", bg:"linear-gradient(135deg,#ff5b8d,#ff7aae)", tag:"Sale" },
  { id:5, name:"Desk Plant",       cat:"Home",    price:32.00, emoji:"🪴", bg:"linear-gradient(135deg,#3ec98a,#7affc8)" },
  { id:6, name:"Smart Watch",      cat:"Tech",    price:149.00,emoji:"⌚", bg:"linear-gradient(135deg,#5b8def,#5bd6ef)" },
  { id:7, name:"Canvas Tote",      cat:"Wear",    price:29.00, emoji:"👜", bg:"linear-gradient(135deg,#d6a15b,#efce5b)" },
  { id:8, name:"Chef's Knife",     cat:"Kitchen", price:64.00, emoji:"🔪", bg:"linear-gradient(135deg,#8d8d8d,#c8c8c8)" },
];

const CART_KEY = "lumen_cart";

function getCart(){
  try { return JSON.parse(localStorage.getItem(CART_KEY)) || {}; }
  catch(e){ return {}; }
}
function saveCart(cart){ localStorage.setItem(CART_KEY, JSON.stringify(cart)); }

function cartCount(){
  const c = getCart();
  return Object.values(c).reduce((a,b)=>a+b,0);
}

function updateBadge(){
  const el = document.getElementById("cartBadge");
  if(el) el.textContent = cartCount();
}

/* ---- functional: add / change / remove ---- */
function addToCart(id){
  const cart = getCart();
  cart[id] = (cart[id]||0) + 1;
  saveCart(cart);
  updateBadge();
  const p = PRODUCTS.find(x=>x.id===id);
  toast(`Added "${p.name}" to cart`);
}

function changeQty(id, delta){
  const cart = getCart();
  cart[id] = (cart[id]||0) + delta;
  if(cart[id] <= 0) delete cart[id];
  saveCart(cart);
  updateBadge();
  renderCart();
}

function removeItem(id){
  const cart = getCart();
  delete cart[id];
  saveCart(cart);
  updateBadge();
  renderCart();
  toast("Item removed");
}

/* ---- rendering ---- */
function renderFeatured(targetId, n){
  const el = document.getElementById(targetId);
  if(!el) return;
  el.innerHTML = PRODUCTS.slice(0, n).map(p=>`
    <div class="card">
      <div class="thumb" style="background:${p.bg}">${p.emoji}</div>
      <div class="card-body">
        <h3>${p.name}</h3>
        <div class="price">$${p.price.toFixed(2)}</div>
        <div class="card-actions">
          <button class="btn" onclick="addToCart(${p.id})">Add to cart</button>
          <button class="wish" onclick="demo('Wishlist')">♡</button>
        </div>
      </div>
    </div>`).join("");
}

function renderCart(){
  const wrap = document.getElementById("items");
  if(!wrap) return;
  const cart = getCart();
  const ids = Object.keys(cart);

  if(ids.length === 0){
    wrap.innerHTML = `<div class="empty">
        <div style="font-size:42px">🛒</div>
        <p>Your cart is empty.</p>
        <a href="products.html"><button class="btn" style="width:auto;padding:11px 22px">Browse products</button></a>
      </div>`;
    setSummary(0);
    return;
  }

  wrap.innerHTML = ids.map(id=>{
    const p = PRODUCTS.find(x=>x.id===Number(id));
    const q = cart[id];
    return `<div class="item">
        <div class="ico" style="background:${p.bg}">${p.emoji}</div>
        <div class="info">
          <h3>${p.name}</h3>
          <div class="cat">${p.cat}</div>
        </div>
        <div class="qty">
          <button onclick="changeQty(${p.id},-1)">−</button>
          <span>${q}</span>
          <button onclick="changeQty(${p.id},1)">+</button>
        </div>
        <div class="price">$${(p.price*q).toFixed(2)}</div>
        <button class="remove" onclick="removeItem(${p.id})" title="Remove">🗑️</button>
      </div>`;
  }).join("");

  const subtotal = ids.reduce((sum,id)=>{
    const p = PRODUCTS.find(x=>x.id===Number(id));
    return sum + p.price*cart[id];
  },0);
  setSummary(subtotal);
}

function setSummary(subtotal){
  const tax = subtotal * 0.08;
  const total = subtotal + tax;
  const set = (id,val)=>{ const el=document.getElementById(id); if(el) el.textContent = "$"+val.toFixed(2); };
  set("subtotal", subtotal);
  set("tax", tax);
  set("total", total);
}

/* ---- non-functional buttons: friendly demo notice ---- */
function demo(label){
  toast(`"${label}" is just for show in this demo`);
}

/* ---- toast helper ---- */
let toastTimer;
function toast(msg){
  let t = document.getElementById("toast");
  if(!t){
    t = document.createElement("div");
    t.id = "toast";
    t.className = "toast";
    document.body.appendChild(t);
  }
  t.textContent = msg;
  t.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(()=>t.classList.remove("show"), 1800);
}
