import './style.css';
import { Main } from './main';

document.querySelectorAll('.l-main').forEach((el) => {
  new Main({ el });
});
