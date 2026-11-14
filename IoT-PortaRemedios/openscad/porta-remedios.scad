// =============================================================================
 // PortaRemédios Inteligente — molde 3D (OpenSCAD)
 // 7 casinhas + baia ESP32 + bolsos para reed switch / imã
 // Unidades: milímetros
 // Abrir no OpenSCAD → F6 (Render) → Export → STL
 // =============================================================================

 /* [Modo de exportação] */
 // "corpo" | "tampa" | "tampa_todas" | "montagem" | "explodido"
 peca = "montagem";

 /* [Layout] */
 dias = 7;
 cell_w = 28;
 cell_d = 36;
 cell_h = 22;
 wall = 2.2;
 floor_t = 2.4;
 gap = 1.6;
 fillet = 1.2;

 /* [Tampa] */
 lid_t = 2.0;
 lid_clearance = 0.35;
 hinge_pin_d = 2.2;
 hinge_ear_t = 2.4;

 /* [Sensor reed + imã] */
 reed_slot_l = 16;
 reed_slot_w = 3.2;
 reed_slot_h = 3.0;
 magnet_d = 6.2;
 magnet_h = 2.2;

 /* [ESP32 DevKit 30-pin típico ~55x28x13] */
 esp_bay_w = 58;
 esp_bay_d = 32;
 esp_bay_h = 18;
 usb_cut_w = 12;
 usb_cut_h = 8;
 antenna_slot_w = 18;
 antenna_slot_h = 4;

 /* [Canal de fiação sob o piso] */
 wire_channel_w = 6;
 wire_channel_h = 3.5;

 $fn = 48;

 // ---------------------------------------------------------------------------
 labels = ["SEG", "TER", "QUA", "QUI", "SEX", "SAB", "DOM"];

 body_w = dias * cell_w + (dias + 1) * gap + wall * 2 + esp_bay_w + wall;
 body_d = cell_d + wall * 2 + gap * 2;
 body_h = cell_h + floor_t + wire_channel_h;

 module rounded_box(size, r = 1) {
     hull() {
         for (x = [r, size.x - r])
             for (y = [r, size.y - r])
                 for (z = [r, size.z - r])
                     translate([x, y, z]) sphere(r = r);
     }
 }

 module cell_cavity() {
     cube([cell_w, cell_d, cell_h + 0.2]);
 }

 module reed_pocket() {
     // bolso na parede traseira da casinha (reed normalmente fechado com tampa)
     cube([reed_slot_l, reed_slot_w, reed_slot_h], center = true);
 }

 module magnet_pocket() {
     cylinder(d = magnet_d, h = magnet_h + 0.2);
 }

 module hinge_ears_body(i) {
     x0 = wall + gap + i * (cell_w + gap) + cell_w / 2;
     y = body_d - wall / 2;
     z = body_h - 1;
     for (sx = [-1, 1]) {
         translate([x0 + sx * (cell_w / 2 - 3), y, z])
             difference() {
                 cube([hinge_ear_t, wall + 2, 6], center = true);
                 rotate([90, 0, 0])
                     cylinder(d = hinge_pin_d + 0.25, h = wall + 4, center = true);
             }
     }
 }

 module wire_channel() {
     // canal longitudinal sob as casinhas até a baia ESP32
     translate([wall, (body_d - wire_channel_w) / 2, floor_t])
         cube([body_w - wall * 2 - 2, wire_channel_w, wire_channel_h + 0.1]);
 }

 module esp32_bay() {
     x = wall + gap + dias * (cell_w + gap) + wall;
     y = (body_d - esp_bay_d) / 2;
     z = floor_t + wire_channel_h;
     translate([x, y, z])
         cube([esp_bay_w, esp_bay_d, esp_bay_h + 0.2]);

     // corte USB-C na parede lateral externa
     translate([body_w - wall - 0.1, body_d / 2 - usb_cut_w / 2, z + 3])
         cube([wall + 2, usb_cut_w, usb_cut_h]);

     // folga antena / LED
     translate([x + esp_bay_w - antenna_slot_w - 2, y - 0.1, z + esp_bay_h - antenna_slot_h])
         cube([antenna_slot_w, wall + 1, antenna_slot_h + 1]);

     // furos de parafuso M2 (suporte DevKit)
     for (dx = [6, esp_bay_w - 6])
         for (dy = [6, esp_bay_d - 6])
             translate([x + dx, y + dy, z - 1])
                 cylinder(d = 2.2, h = 6);
 }

 module label_engrave(i) {
     x0 = wall + gap + i * (cell_w + gap) + cell_w / 2;
     translate([x0, wall + 1.2, body_h - 0.6])
         linear_extrude(height = 0.8)
             text(labels[i], size = 4.2, halign = "center", valign = "center", font = "Arial:style=Bold");
 }

 module corpo() {
     difference() {
         // casco externo
         rounded_box([body_w, body_d, body_h], fillet);

         // cavidades das casinhas
         for (i = [0 : dias - 1]) {
             x = wall + gap + i * (cell_w + gap);
             y = wall + gap;
             z = floor_t + wire_channel_h;
             translate([x, y, z]) cell_cavity();

             // bolso reed na parede traseira
             translate([
                 x + cell_w / 2,
                 y + cell_d - reed_slot_w / 2 + 0.4,
                 z + cell_h - reed_slot_h / 2 - 1
             ]) reed_pocket();

             // passagem de fio do reed para o canal
             translate([x + cell_w / 2 - 1.5, y + cell_d - 1, floor_t])
                 cube([3, 4, wire_channel_h + cell_h]);
         }

         wire_channel();
         esp32_bay();

         // tampa da baia ESP32 (rebaixo)
         translate([
             wall + gap + dias * (cell_w + gap) + wall - 1,
             (body_d - esp_bay_d) / 2 - 1,
             body_h - 1.2
         ]) cube([esp_bay_w + 2, esp_bay_d + 2, 2]);

         for (i = [0 : dias - 1]) label_engrave(i);
     }

     for (i = [0 : dias - 1]) hinge_ears_body(i);

     // nervuras de reforço no canal
     for (i = [1 : dias]) {
         x = wall + gap + i * (cell_w + gap) - gap / 2;
         translate([x - 0.6, (body_d - wire_channel_w) / 2 - 1, floor_t])
             cube([1.2, wire_channel_w + 2, wire_channel_h]);
     }
 }

 module tampa(i = 0) {
     w = cell_w - lid_clearance;
     d = cell_d - lid_clearance;
     difference() {
         union() {
             rounded_box([w, d, lid_t], 0.8);
             // orelhas da dobradiça
             for (sx = [-1, 1]) {
                 translate([w / 2 + sx * (w / 2 - 3) - hinge_ear_t / 2, d - 0.2, lid_t / 2])
                     difference() {
                         cube([hinge_ear_t, 5, 5]);
                         translate([hinge_ear_t / 2, 3, 2.5])
                             rotate([0, 90, 0])
                                 cylinder(d = hinge_pin_d, h = hinge_ear_t + 1, center = true);
                     }
             }
             // aba de abertura frontal
             translate([w / 2 - 6, -3, 0])
                 rounded_box([12, 4, lid_t], 0.6);
         }
         // cavidade do imã (alinhada ao reed)
         translate([w / 2, d - 4, lid_t - magnet_h + 0.05])
             magnet_pocket();
         // gravura do dia
         translate([w / 2, d / 2, lid_t - 0.5])
             linear_extrude(height = 0.6)
                 text(labels[i], size = 5, halign = "center", valign = "center", font = "Arial:style=Bold");
     }
 }

 module tampa_todas() {
     for (i = [0 : dias - 1]) {
         translate([i * (cell_w + 4), 0, 0]) tampa(i);
     }
 }

 module montagem() {
     corpo();
     for (i = [0 : dias - 1]) {
         x = wall + gap + i * (cell_w + gap) + lid_clearance / 2;
         y = wall + gap + lid_clearance / 2;
         translate([x, y, body_h])
             color(i % 2 == 0 ? "#2A9D8F" : "#264653") tampa(i);
     }
     // ESP32 esquemático
     x = wall + gap + dias * (cell_w + gap) + wall + 2;
     y = (body_d - 28) / 2;
     z = floor_t + wire_channel_h + 1;
     translate([x, y, z])
         color("#1B4332") cube([52, 28, 7]);
 }

 module explodido() {
     corpo();
     for (i = [0 : dias - 1]) {
         x = wall + gap + i * (cell_w + gap) + lid_clearance / 2;
         y = wall + gap + lid_clearance / 2;
         translate([x, y, body_h + 18 + i * 2])
             color("#2A9D8F") tampa(i);
     }
 }

 if (peca == "corpo") corpo();
 else if (peca == "tampa") tampa(0);
 else if (peca == "tampa_todas") tampa_todas();
 else if (peca == "explodido") explodido();
 else montagem();
