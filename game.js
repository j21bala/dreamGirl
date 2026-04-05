const config = {
    type: Phaser.AUTO,
    parent: 'game-container',
    width: 800,
    height: 600,
    pixelArt: true,
    transparent: true, // Permite ver el fondo GIF mediante CSS si lo tienes ahí
    scale: { mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_BOTH },
    scene: { preload: preload, create: create }
};

const game = new Phaser.Game(config);

const guion = [
    { nombre: "Juan", texto: "Hola, Abi... No sabía cómo decirte esto." },
    { nombre: "Juan", texto: "Hemos pasado momentos increíbles." },
    { nombre: "Juan", texto: "¿Quieres ser mi novia?" }
];

let indice = 0;

function preload() {
    // Cargar imágenes individuales para los personajes
    this.load.image('juan_stand', 'movements/standart_juan/1.png');
    this.load.image('abi_stand', 'movements/standart_abi/1.png');
    
    // Cargar frames para la animación de espadazo
    for (let i = 1; i <= 6; i++) {
        this.load.image(`custom_juan_${i}`, `movements/custom_juan/${i}.png`);
    }
}

function create() {
    // Personajes (Empiezan fuera de pantalla)
    this.juan = this.add.image(-50, 450, 'juan_stand').setScale(1).setDepth(10);
    this.abi = this.add.image(850, 450, 'abi_stand').setScale(1).setDepth(10);
    this.abi.setFlipX(true);

    // Caja de diálogo
    this.caja = this.add.graphics().fillStyle(0x4b2d1f, 0.9).lineStyle(4, 0xf3da4c, 1);
    this.caja.fillRoundedRect(50, 420, 700, 150, 15).setVisible(false).setDepth(5);
    
    this.txtNombre = this.add.text(70, 390, '', { fontSize: '28px', fill: '#f3da4c', fontStyle: 'bold' }).setVisible(false).setDepth(6);
    this.txtMensaje = this.add.text(80, 450, '', { fontSize: '22px', fill: '#ffffff' }).setVisible(false).setDepth(6);

    // Modal japonés gigante
    this.modal = this.add.graphics().fillStyle(0xfdf6e3, 1).lineStyle(12, 0xb32a2a, 1);
    this.modal.fillRoundedRect(100, 100, 600, 400, 20).setVisible(false).setDepth(5);
    this.modalText = this.add.text(400, 200, '¿QUIERES SER MI NOVIA?', { fontSize: '30px', fill: '#2e1a1a', align: 'center' }).setOrigin(0.5).setVisible(false).setDepth(6);

    this.animating = false;

    // Movimiento
    this.tweens.add({ targets: this.juan, x: 300, duration: 2500 });
    this.tweens.add({ targets: this.abi, x: 500, duration: 2500, onComplete: () => {
        this.caja.setVisible(true);
        this.txtNombre.setVisible(true);
        this.txtMensaje.setVisible(true);
        mostrarTexto(this);
    }});

    // Clic para avanzar
    this.input.on('pointerdown', () => {
        if (this.caja.visible && !this.animating) {
            indice++;
            if (indice < guion.length) {
                mostrarTexto(this);
            } else if (indice === guion.length) {
                mostrarBotones(this);
            }
        }
    });
}

function mostrarTexto(escena) {
    let actual = guion[indice];
    escena.txtNombre.setText(actual.nombre);
    escena.txtMensaje.setText(actual.texto);
    
    if (indice === guion.length - 1) {
        escena.animating = true;
        setTimeout(() => {
            animacionEspecial(escena);
        }, 1000);
    }
}

function animacionEspecial(escena) {
    // Animación de espadazo: cambiar frames
    let frame = 1;
    const interval = setInterval(() => {
        if (frame <= 6) {
            escena.juan.setTexture(`custom_juan_${frame}`);
            frame++;
        } else {
            clearInterval(interval);
            escena.juan.setTexture('juan_stand'); // volver a stand
            escena.animating = false;
            indice++;
            mostrarBotones(escena);
        }
    }, 100);
}

function mostrarBotones(escena) {
    if (escena.btnSi) return;

    // Ocultar caja de diálogo
    escena.caja.setVisible(false);
    escena.txtNombre.setVisible(false);
    escena.txtMensaje.setVisible(false);

    // Mostrar modal gigante
    escena.modal.setVisible(true);
    escena.modalText.setVisible(true);

    // Botones dentro del modal
    escena.btnSi = escena.add.text(300, 350, ' SÍ ', { fontSize: '40px', backgroundColor: '#b32a2a', fill: '#fff', padding: 10 })
        .setInteractive({ useHandCursor: true })
        .setDepth(7)
        .on('pointerdown', () => {
            escena.modal.setVisible(false);
            escena.modalText.setVisible(false);
            escena.txtMensaje.setText("¡TE AMO! ❤️");
            escena.txtMensaje.setVisible(true);
            escena.btnSi.destroy();
            escena.btnNo.destroy();
        });

    escena.btnNo = escena.add.text(450, 350, ' NO ', { fontSize: '40px', backgroundColor: '#fff', fill: '#2e1a1a', padding: 10 })
        .setInteractive()
        .setDepth(7)
        .on('pointerover', () => {
            escena.btnNo.x = Phaser.Math.Between(150, 650);
            escena.btnNo.y = Phaser.Math.Between(150, 450);
        });
}