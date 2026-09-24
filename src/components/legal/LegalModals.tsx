import React from 'react';
import { Modal } from '../common/Modal';
import { BRAND } from '../../config/brand.config';

interface LegalModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PrivacyPolicyModal: React.FC<LegalModalProps> = ({ isOpen, onClose }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Política de Privacidad" maxWidth="md">
      <div className="space-y-3 text-xs text-slate-300 leading-relaxed max-h-[60vh] overflow-y-auto pr-1">
        <p className="text-slate-400">Última actualización: septiembre 2026 · {BRAND.name} v{BRAND.version}</p>
        <p>
          <strong className="text-white">1. Datos en tu dispositivo.</strong> Favoritos, historial de
          descargas, preferencias y el PIN de admin se guardan solo en el almacenamiento local de tu
          teléfono (localStorage / Documents/Yugen). No tenemos servidores ni recibimos tus datos.
        </p>
        <p>
          <strong className="text-white">2. Sin cuentas reales.</strong> El inicio de sesión es una
          demo local: no verifica identidad ni sincroniza entre dispositivos.
        </p>
        <p>
          <strong className="text-white">3. Anuncios.</strong> La app usa IDs de prueba de AdMob
          (modo test): no se muestra publicidad real ni se recogen identificadores publicitarios.
          Antes de publicar con anuncios reales se pedirá consentimiento (UMP) donde aplique.
        </p>
        <p>
          <strong className="text-white">4. Permisos Android.</strong> Internet (cargar imágenes),
          almacenamiento (guardar fondos en Documents/Yugen) y fijar fondo de pantalla. No se accede
          a contactos, ubicación ni cámara.
        </p>
        <p>
          <strong className="text-white">5. Imágenes.</strong> Catálogo de demostración (Unsplash / IA).
          Si eres titular de derechos y quieres una retirada, escríbenos.
        </p>
        <p>
          <strong className="text-white">6. Borrar tus datos.</strong> Perfil → Limpiar caché, o
          desinstala la app: todo lo local se elimina.
        </p>
        <p>
          <strong className="text-white">7. Contacto.</strong> {BRAND.supportEmail}
        </p>
      </div>
    </Modal>
  );
};

export const TermsModal: React.FC<LegalModalProps> = ({ isOpen, onClose }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Términos de Uso" maxWidth="md">
      <div className="space-y-3 text-xs text-slate-300 leading-relaxed max-h-[60vh] overflow-y-auto pr-1">
        <p className="text-slate-400">Última actualización: septiembre 2026</p>
        <p>
          <strong className="text-white">1. Uso personal.</strong> Puedes descargar y usar los fondos
          en tus dispositivos. No redistribuyas el catálogo como propio.
        </p>
        <p>
          <strong className="text-white">2. Versión demo.</strong> Compras, suscripciones y cobros
          mostrados son simulados y no generan cargos ni pagos reales.
        </p>
        <p>
          <strong className="text-white">3. Sin garantía.</strong> La app se ofrece "tal cual"; puede
          fallar sin conexión o en dispositivos antiguos.
        </p>
        <p>
          <strong className="text-white">4. Edad.</strong> Recomendada para mayores de 13 años.
        </p>
        <p>
          <strong className="text-white">5. Contacto.</strong> {BRAND.supportEmail}
        </p>
      </div>
    </Modal>
  );
};
