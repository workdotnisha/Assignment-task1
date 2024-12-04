const swiper = new Swiper('.swiper', {
    loop: true,
  
    // If we need pagination
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
    },
  
    // Navigation arrows
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
  });


  const canvas = document.getElementById('canvas');
  const ctx = canvas.getContext('2d');
  const textInput = document.getElementById('text-input');
  const fontSelect = document.getElementById('font-select');
  const colorPicker = document.getElementById('color-picker');
  const addTextBtn = document.getElementById('add-text-btn');
  const bgColorPicker = document.getElementById('bg-color-picker');
  const imageUpload = document.getElementById('image-upload');
  const stickerUpload = document.getElementById('sticker-upload');
  const undoBtn = document.getElementById('undo-btn');
  const redoBtn = document.getElementById('redo-btn');
  
  let font = 'Arial';
  let color = '#000000';
  let bgColor = '#FFFFFF';
  let history = [];
  let redoStack = [];
  
  // Update font and color
  fontSelect.addEventListener('change', () => font = fontSelect.value);
  colorPicker.addEventListener('change', () => color = colorPicker.value);
  
  // Handle background color change
  bgColorPicker.addEventListener('change', (e) => {
      bgColor = e.target.value;
      history.push({ type: 'backgroundColor', color: bgColor });
      redoStack = [];
      redraw();
  });
  
  // Add text
  addTextBtn.addEventListener('click', () => {
      const text = textInput.value.trim();
      if (text) {
          history.push({ type: 'text', text, font, color, x: 100, y: 100 });
          redoStack = [];
          redraw();
          textInput.value = '';
      }
  });
  
  // Undo and redo functionality
  undoBtn.addEventListener('click', () => {
      if (history.length > 0) {
          redoStack.push(history.pop());
          redraw();
      }
  });
  
  redoBtn.addEventListener('click', () => {
      if (redoStack.length > 0) {
          history.push(redoStack.pop());
          redraw();
      }
  });
  
  // Upload image for background
  imageUpload.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
          const img = new Image();
          img.onload = () => {
              history.push({ type: 'backgroundImage', image: img });
              redoStack = [];
              redraw();
          };
          img.src = URL.createObjectURL(file);
      }
  });
  
  // Upload sticker
  stickerUpload.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
          const img = new Image();
          img.onload = () => {
              history.push({ type: 'sticker', image: img, x: 200, y: 200 });
              redoStack = [];
              redraw();
          };
          img.src = URL.createObjectURL(file);
      }
  });
  
  // Redraw the canvas
  function redraw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
  
      // Default background color
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
  
      for (const action of history) {
          if (action.type === 'backgroundColor') {
              ctx.fillStyle = action.color;
              ctx.fillRect(0, 0, canvas.width, canvas.height);
          } else if (action.type === 'backgroundImage') {
              ctx.drawImage(action.image, 0, 0, canvas.width, canvas.height);
          } else if (action.type === 'sticker') {
              ctx.drawImage(action.image, action.x, action.y, 100, 100);
          } else if (action.type === 'text') {
              ctx.font = `20px ${action.font}`;
              ctx.fillStyle = action.color;
              ctx.fillText(action.text, action.x, action.y);
          }
      }
  }
  
  // Allow placing text or stickers on mouse click
  canvas.addEventListener('mousedown', (e) => {
      const lastAction = history[history.length - 1];
      if (lastAction && (lastAction.type === 'text' || lastAction.type === 'sticker')) {
          lastAction.x = e.offsetX;
          lastAction.y = e.offsetY;
          redraw();
      }
  });
  
  // Initial canvas setup
  redraw();