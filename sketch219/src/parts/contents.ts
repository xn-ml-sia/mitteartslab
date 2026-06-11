
import { Con } from "../con/con";
import { Conf } from "../core/conf";
import { MyDisplay } from "../core/myDisplay";
import { Param } from "../core/param";

// -----------------------------------------
//
// -----------------------------------------
export class Contents extends MyDisplay {

  private _txtA:HTMLElement;
  private _txtB:HTMLElement;
  private _fitHandler: () => void;
  private _resizeObserver: ResizeObserver | null = null;

  constructor(opt:any) {
    super(opt)

    this._txtA = this.el.querySelector('.l-select.-a') as HTMLElement;
    this._txtA.innerHTML = this._headlineMarkup();

    this._txtB = this.el.querySelector('.l-select.-b') as HTMLElement;
    this._txtB.innerHTML = Conf.instance.TEXT_B;

    this._fitHandler = this._fitSelectText.bind(this);
    const runFit = async () => {
      if (document.fonts?.load) {
        await Promise.all([
          document.fonts.load('600 12px Kaluar'),
          document.fonts.load('600 60px Kaluar'),
          document.fonts.load('400 12px Kaluar'),
          document.fonts.load('400 24px Kaluar'),
        ]);
      }
      this._fitSelectText();
    };

    requestAnimationFrame(() => {
      runFit();
    });
    window.addEventListener('resize', this._fitHandler);

    const root = this.el.closest('.portfolio-sketch219') as HTMLElement | null;
    if (root && typeof ResizeObserver !== 'undefined') {
      this._resizeObserver = new ResizeObserver(() => {
        this._fitSelectText();
      });
      this._resizeObserver.observe(root);
    }

    new Con({
      el: this.el.querySelector('.l-canvas')
    });
  }

  private _headlineMarkup(): string {
    const conf = Conf.instance;
    return `
      <span class="l-headline__layout">
        <span class="l-headline__stack" aria-hidden="true">
          <span class="l-headline__lead">${conf.TEXT_A_LEAD}</span>
          <span class="l-headline__that">${conf.TEXT_A_STACK}</span>
        </span>
        <span class="l-headline__ship">${conf.TEXT_A_SHIP}</span>
        <span class="l-headline__tail-stack">
          <span class="l-headline__onchain">${conf.TEXT_A_ONCHAIN}</span>
          <span class="l-headline__scale">${conf.TEXT_A_SCALE}</span>
        </span>
        <span class="l-headline__brand">${conf.TEXT_A_BRAND}</span>
      </span>
    `.trim();
  }

  private _measureTextWidth(text: string, size: number, weight = 600): number {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return 0;
    ctx.font = `${weight} ${size}px Kaluar`;
    return ctx.measureText(text).width;
  }

  private _matchWidth(target: HTMLElement, reference: HTMLElement): void {
    target.style.transform = 'none';
    const refWidth = reference.getBoundingClientRect().width;
    const targetWidth = target.getBoundingClientRect().width;
    if (refWidth > 0 && targetWidth > 0) {
      target.style.transform = `scaleX(${refWidth / targetWidth})`;
    }
  }

  private _syncHeadlineScales(): void {
    const lead = this._txtA.querySelector('.l-headline__lead') as HTMLElement | null;
    const that = this._txtA.querySelector('.l-headline__that') as HTMLElement | null;
    const stack = this._txtA.querySelector('.l-headline__stack') as HTMLElement | null;
    const ship = this._txtA.querySelector('.l-headline__ship') as HTMLElement | null;
    const onchain = this._txtA.querySelector('.l-headline__onchain') as HTMLElement | null;
    const scale = this._txtA.querySelector('.l-headline__scale') as HTMLElement | null;
    const brand = this._txtA.querySelector('.l-headline__brand') as HTMLElement | null;

    if (lead && that) {
      this._matchWidth(that, lead);
    }

    if (onchain && scale) {
      this._matchWidth(scale, onchain);
    }

    if (stack && ship) {
      ship.style.transform = 'none';
      const stackHeight = stack.getBoundingClientRect().height;
      const shipHeight = ship.getBoundingClientRect().height;
      if (shipHeight > 0 && stackHeight > 0) {
        ship.style.transform = `scaleY(${stackHeight / shipHeight})`;
      }
    }

    if (ship && brand) {
      brand.style.transform = 'none';
      const shipHeight = ship.getBoundingClientRect().height;
      const brandHeight = brand.getBoundingClientRect().height;
      if (brandHeight > 0 && shipHeight > 0) {
        brand.style.transform = `scaleY(${shipHeight / brandHeight})`;
      }
    }
  }

  private _fitHeadline(): void {
    const layout = this._txtA.querySelector('.l-headline__layout') as HTMLElement | null;
    if (!layout) return;

    const style = window.getComputedStyle(this._txtA);
    const pad = parseFloat(style.paddingLeft) + parseFloat(style.paddingRight);
    const avail = this._txtA.getBoundingClientRect().width - pad;
    let size = 60;

    while (size > 8) {
      this._txtA.style.fontSize = `${size}px`;
      this._syncHeadlineScales();
      if (layout.getBoundingClientRect().width <= avail * 0.98) break;
      size -= 0.5;
    }
  }

  private _fitSubs(): void {
    const layout = this._txtA.querySelector('.l-headline__layout') as HTMLElement | null;
    if (!layout) return;

    const targetWidth = layout.getBoundingClientRect().width;
    const text = Conf.instance.TEXT_B;
    let size = 24;

    this._txtB.style.transform = 'none';
    this._txtB.style.fontSize = `${size}px`;

    while (size < 36) {
      const nextWidth = this._measureTextWidth(text, size + 0.5, 400);
      if (nextWidth > targetWidth) break;
      size += 0.5;
    }

    this._txtB.style.fontSize = `${size}px`;

    const subsWidth = this._txtB.getBoundingClientRect().width;
    if (subsWidth > 0 && targetWidth > 0) {
      this._txtB.style.transform = `scaleX(${targetWidth / subsWidth})`;
    }
  }

  private _fitSelectText(): void {
    this._fitHeadline();
    this._fitSubs();
  }

  private _localTextOffset(container: HTMLElement, targetNode: Node, targetOffset: number): number {
    const walker = document.createTreeWalker(container, NodeFilter.SHOW_TEXT);
    let count = 0;
    let node: Node | null;

    while ((node = walker.nextNode())) {
      if (node === targetNode) {
        return count + targetOffset;
      }
      count += node.textContent?.length ?? 0;
    }

    return count;
  }

  private _selectionRangeInHeadline(): [number, number] | null {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return null;

    const range = selection.getRangeAt(0);
    if (!this._txtA.contains(range.startContainer)) return null;

    const conf = Conf.instance;
    const lead = this._txtA.querySelector('.l-headline__lead') as HTMLElement;
    const that = this._txtA.querySelector('.l-headline__that') as HTMLElement;
    const ship = this._txtA.querySelector('.l-headline__ship') as HTMLElement;
    const onchain = this._txtA.querySelector('.l-headline__onchain') as HTMLElement;
    const scale = this._txtA.querySelector('.l-headline__scale') as HTMLElement;
    const brand = this._txtA.querySelector('.l-headline__brand') as HTMLElement;
    const shipStart =
      conf.TEXT_A_LEAD.length + 1 + conf.TEXT_A_STACK.length + 1;
    const onchainStart = shipStart + conf.TEXT_A_SHIP.length + 1;
    const scaleStart = onchainStart + conf.TEXT_A_ONCHAIN.length + 1;
    const brandStart = scaleStart + conf.TEXT_A_SCALE.length + 1;

    const mapGlobal = (node: Node, offset: number): number => {
      if (lead?.contains(node)) {
        return this._localTextOffset(lead, node, offset);
      }
      if (that?.contains(node)) {
        return conf.TEXT_A_LEAD.length + 1 + this._localTextOffset(that, node, offset);
      }
      if (ship?.contains(node)) {
        return shipStart + this._localTextOffset(ship, node, offset);
      }
      if (onchain?.contains(node)) {
        return onchainStart + this._localTextOffset(onchain, node, offset);
      }
      if (scale?.contains(node)) {
        return scaleStart + this._localTextOffset(scale, node, offset);
      }
      if (brand?.contains(node)) {
        return brandStart + this._localTextOffset(brand, node, offset);
      }
      return 0;
    };

    const start = mapGlobal(range.startContainer, range.startOffset);
    const end = mapGlobal(range.endContainer, range.endOffset);
    return start <= end ? [start, end] : [end, start];
  }

  private _selectionRangeIn(el: HTMLElement): [number, number] | null {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return null;
    if (!el.contains(selection.anchorNode) || !el.contains(selection.focusNode)) {
      return null;
    }

    const range = selection.getRangeAt(0);
    const start = this._localTextOffset(el, range.startContainer, range.startOffset);
    const end = this._localTextOffset(el, range.endContainer, range.endOffset);
    return start <= end ? [start, end] : [end, start];
  }

  protected _resize(): void {
    super._resize();
    this._fitSelectText();
  }

  public dispose(): void {
    window.removeEventListener('resize', this._fitHandler);
    if (this._resizeObserver) {
      this._resizeObserver.disconnect();
      this._resizeObserver = null;
    }
    super.dispose();
  }


  protected _update(): void {
    super._update();

    let selectType = -1;
    const selection = window.getSelection();
    const anchorNode = selection?.anchorNode;

    if (anchorNode && this._txtA.contains(anchorNode)) {
      selectType = 0;
    } else if (anchorNode && this._txtB.contains(anchorNode)) {
      selectType = 1;
    }

    if (selectType != -1) {
      const range =
        selectType === 0
          ? this._selectionRangeInHeadline()
          : this._selectionRangeIn(this._txtB);
      const start = range?.[0] ?? 0;
      const end = range?.[1] ?? 0;

      Param.instance.selectedNo[selectType][0] = start;
      Param.instance.selectedNo[selectType][1] = end;

      if (Param.instance.debug) {
        Param.instance.debug.innerHTML = ['A', 'B'][selectType] + '_' + start + '_' + end;
      }
    }
  }
}
