import './portfolio-style.css';
import { Main } from './main';

const root = document.querySelector('.portfolio-sketch501');
if (root) {
  root.querySelectorAll('.l-main').forEach((el) => {
    new Main({ el });
  });
}
