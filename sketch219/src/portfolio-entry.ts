import './portfolio-style.css';
import { Contents } from './parts/contents';
import { Func } from './core/func';

const root = document.querySelector('.portfolio-sketch219') as HTMLElement | null;
const main = root?.querySelector('.l-main') as HTMLElement | null;

if (root && main) {
  Func.instance.setRoot(root);
  new Contents({ el: main });
}
