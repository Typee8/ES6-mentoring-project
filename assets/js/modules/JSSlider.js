export default class JSSlider {
  constructor(imagesSelector) {
    this.imagesSelector = imagesSelector;
    this.sliderRootSelector = ".js-slider";
    this.imagesList = document.querySelectorAll(this.imagesSelector);
    this.sliderRootElement = document.querySelector(this.sliderRootSelector);
  }

  run() {
    const { imagesList, sliderRootElement, imagesSelector } = this;

    this.initEvents(imagesList, sliderRootElement);
    this.initCustomEvents(imagesList, sliderRootElement, imagesSelector);
  }

  initEvents(imagesList, sliderRootElement) {
    this.prepareShowImg(imagesList);
    this.prepareSlideNext(sliderRootElement);
    this.prepareSlidePrev(sliderRootElement);
    this.prepareSliderClose(sliderRootElement);
  }

  prepareShowImg(imagesList) {
    imagesList.forEach((item) => {
      item.addEventListener("click", (e) => {
        this.fireCustomEvent(e.currentTarget, "js-slider-img-click");
      });
    });
  }

  prepareSlideNext(sliderRootElement) {
    const navNext = sliderRootElement.querySelector(".js-slider__nav--next");

    if (navNext) {
      navNext.addEventListener("click", (e) => {
        this.fireCustomEvent(sliderRootElement, "js-slider-img-next");
      });
    }
  }

  prepareSlidePrev(sliderRootElement) {
    const navPrev = sliderRootElement.querySelector(".js-slider__nav--prev");
    if (navPrev) {
      navPrev.addEventListener("click", (e) => {
        this.fireCustomEvent(sliderRootElement, "js-slider-img-prev");
      });
    }
  }

  prepareSliderClose(sliderRootElement) {
    const zoom = sliderRootElement.querySelector(".js-slider__zoom");
    if (zoom) {
      zoom.addEventListener("click", (e) => {
        if (e.target === e.currentTarget) {
          this.fireCustomEvent(sliderRootElement, "js-slider-close");
        }
      });
    }
  }

  fireCustomEvent(element, name) {
    console.log(element.className, "=>", name);
    const event = new CustomEvent(name, { bubbles: true });
    element.dispatchEvent(event);
  }

  initCustomEvents(imagesList, sliderRootElement, imagesSelector) {
    console.log(this);
    imagesList.forEach((img) => {
      img.addEventListener("js-slider-img-click", (event) => {
        this.onImageClick(event, sliderRootElement, imagesSelector);
      });
    });

    sliderRootElement.addEventListener("js-slider-img-next", (event) => {
      this.onImageNext(event);
    });
    sliderRootElement.addEventListener("js-slider-img-prev", (event) => {
      this.onImagePrev(event);
    });
    sliderRootElement.addEventListener("js-slider-close", (event) => {
      this.onClose(event);
    });
  }

  onImageClick(event, sliderRootElement, imagesSelector) {
    this.showHideSlider(sliderRootElement);
    const src = event.currentTarget.querySelector("img").src;
    this.showClickedImg(src, sliderRootElement);
    this.showThumbImgs(event, src, imagesSelector);
  }

  showHideSlider(sliderRootElement) {
    sliderRootElement.classList.toggle("js-slider--active");
  }

  showClickedImg(src, sliderRootElement) {
    sliderRootElement.querySelector(".js-slider__image").src = src;
  }

  getThumbsList(event, imagesSelector) {
    const groupName = event.currentTarget.dataset.sliderGroupName;
    const thumbsList = document.querySelectorAll(
      `${imagesSelector}[data-slider-group-name=${groupName}]`
    );
    return thumbsList;
  }

  showThumbImgs(event, src, imagesSelector) {
    const prototype = document.querySelector(
      ".js-slider__thumbs-item--prototype"
    );
    const thumbsList = this.getThumbsList(event, imagesSelector);
    console.log(thumbsList);
    thumbsList.forEach((item) => {
      const thumbElement = this.cloneThumbsProto(prototype);
      this.assignThumbImgs(thumbElement, item, src);
      document.querySelector(".js-slider__thumbs").appendChild(thumbElement);
    });
  }

  cloneThumbsProto(prototype) {
    const thumbElement = prototype.cloneNode(true);
    thumbElement.classList.remove("js-slider__thumbs-item--prototype");
    return thumbElement;
  }

  assignThumbImgs(thumbElement, item, src) {
    const thumbImg = thumbElement.querySelector("img");
    thumbImg.src = item.querySelector("img").src;
    if (thumbImg.src === src) {
      thumbImg.classList.add("js-slider__thumbs-image--current");
    }
  }

  onImageNext(event) {
    console.log(event.currentTarget, "onImageNext");
    const { currentClassName, current, nextElement } =
      this.createOnImageVariables(event);
    this.showSelectedImage(event, currentClassName, current, nextElement);
  }

  showSelectedImage(event, currentClassName, current, selectedElement) {
    if (
      selectedElement &&
      !selectedElement.className.includes("js-slider__thumbs-item--prototype")
    ) {
      const img = selectedElement.querySelector("img");
      img.classList.add(currentClassName);

      event.currentTarget.querySelector(".js-slider__image").src = img.src;
      current.classList.remove(currentClassName);
    }
  }

  onImagePrev(event) {
    console.log(this, "onImagePrev");
    const { currentClassName, current, prevElement } =
      this.createOnImageVariables(event);
    this.showSelectedImage(event, currentClassName, current, prevElement);
  }

  createOnImageVariables(event) {
    const currentClassName = "js-slider__thumbs-image--current";
    const current = event.currentTarget.querySelector("." + currentClassName);
    const parentCurrent = current.parentElement;
    const nextElement = parentCurrent.nextElementSibling;
    const prevElement = parentCurrent.previousElementSibling;

    return { currentClassName, current, nextElement, prevElement };
  }

  onClose(event) {
    this.showHideSlider(event.currentTarget);
    this.removeThumbs(event);
  }

  removeThumbs(event) {
    const thumbsList = event.currentTarget.querySelectorAll(
      ".js-slider__thumbs-item:not(.js-slider__thumbs-item--prototype)"
    );
    thumbsList.forEach((item) => item.parentElement.removeChild(item));
  }
}
