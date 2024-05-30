"use client";
import { useRef, useState } from "react";
import { MdFacebook, MdWhatsapp } from "react-icons/md";
import { BsTwitterX } from "react-icons/bs";

import classNames from "classnames";
import domtoimage from "dom-to-image";
import { FaChevronDown, FaChevronUp } from "react-icons/fa6";
import fondo from './bg.webp'

const Component = () => {
  const [openSocial, setOpenSocial] = useState(false);
  const refImgContainer = useRef(null);
  const [openDetail, setOpenDetail] = useState(true);

  const dataURLToBlob = (dataUrl: string) => {
    const parts = dataUrl.split(";base64,");
    const contentType = parts[0].split(":")[1];
    const raw = window.atob(parts[1]);
    const rawLength = raw.length;

    const uInt8Array = new Uint8Array(rawLength);

    for (let i = 0; i < rawLength; ++i) {
      uInt8Array[i] = raw.charCodeAt(i);
    }

    return new Blob([uInt8Array], { type: contentType });
  };

  const copyImageToClipboard = async (blob: Blob) => {
    try {
      const clipboardItem = new ClipboardItem({ "image/png": blob });
      await navigator.clipboard.write([clipboardItem]);
      console.log("Image copied to clipboard successfully!");
    } catch (error) {
      console.error("Failed to copy image to clipboard", error);
    }
  };

  const onDownload = async (element: any, shouldDownload: boolean) => {
    if (element && element?.style) {
      element.style.overflow = "visible";
      try {
        const blob = await domtoimage.toBlob(element);
        const url = URL.createObjectURL(blob);
        const file = new File([blob], "my-image-name.png", {
          type: "image/png",
        });

        if (shouldDownload) {
          if (navigator.canShare && navigator.canShare({ files: [file] })) {
            try {
              await navigator.share({
                files: [
                  new File([file], "my-image-name.png", {
                    type: "image/png",
                  }),
                ],
                title: "Compartir Imagen",
                text: "¡Mira esta imagen!",
              });
              console.log("Image shared successfully!");
            } catch (error) {
              console.error("Error sharing image:", error);
            }
          } else {
            const link = document.createElement("a");
            link.href = url;
            link.download = "my-image-name.png";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
          }
        } else {
          await copyImageToClipboard(file);
        }

        URL.revokeObjectURL(url);
        element.style.overflow = "auto";
      } catch (error) {
        console.error("Oops, something went wrong!", error);
        element.style.overflow = "auto";
      }
    }
  };

  const handleMessage = (type: string) => {
    const idBet = "aasdasd";
    const message = `¡Consulta los partidos por los que has apostado en apuestatotal y haz clic aquí para colocar las mismas apuestas con un solo clic! https://web-at.kurax.dev/apuestas-deportivas/?betId=${idBet}#/overview`;
    let urlLink = "";

    if (type === "1") {
      urlLink = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
        `https://web-at.kurax.dev/apuestas-deportivas/?betId=${idBet}#/overview`
      )}`;
    } else if (type === "2") {
      urlLink = `https://api.whatsapp.com/send?text=${encodeURIComponent(
        message
      )}`;
    } else if (type === "3") {
      urlLink = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
        message
      )}`;
    } else if (type === "4") {
      navigator.clipboard
        .writeText(message)
        .then(() => {
          alert("Mensaje copiado al portapapeles");
        })
        .catch((err) => {
          console.error("Error al copiar al portapapeles: ", err);
        });
      return; // Salir de la función para no crear un enlace innecesario
    } else {
      console.error("Tipo no reconocido");
      return;
    }

    if (urlLink) {
      const link = document.createElement("a");
      link.href = urlLink;
      link.target = "_blank"; // Abrir en una nueva pestaña
      link.click();
    }
  };
  const events = [
    {
      selection: "asdasdasd",
      odds: "12.0",
      event_name: "asdasdasdasd",
      event_date: "10/10 hoy",
    },
  ];
  return (
    <div className="flex justify-center items-center w-screen h-screen">
      <div className="w-[350px] bg-white h-[60%] max-h-[80vh] md:w-[450px] min-h-[410px] grid grid-rows-[auto_1fr_auto] text-black">
        <div className="flex p-4 justify-center items-center font-bold text-lg ">
          Comparte tu apuesta
        </div>
        <div
          className="bg-center bg-cover bg-no-repeat overflow-auto grid grid-rows-[auto_1fr] bg-[url(bg.webp)]"
          ref={refImgContainer}
        >
          <div className="flex justify-center items-center p-2">
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/d/d2/Apuesta_total_logo.svg"
              alt=""
              className="w-[200px] h-auto"
            />
          </div>
          <div className="flex justify-center items-center my-4">
            <div className="w-[90%] h-auto min-h-[80%] rounded-[11px] bg-white border border-gray-300 text-[12px] grid grid-rows-[auto_1fr_auto]">
              <div className="p-6 border-b border-gray-300 flex justify-between">
                <div className="flex">
                  <span className="max-w-[220px] truncate">
                    <strong>multibple </strong>
                    s/ 100 000
                  </span>
                  <div className="flex">
                    <strong>10.0</strong>
                    <div onClick={() => setOpenDetail((state) => !state)}>
                      {openDetail ? (
                        <FaChevronDown size={18} />
                      ) : (
                        <FaChevronUp size={18} />
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div
                className={classNames("p-2 border-b border-gray-300", {
                  hidden: !openDetail,
                })}
              >
                {events.map((item: any, idx: number) => (
                  <div key={idx} className="grid grid-rows-[1fr_1fr_1fr] pb-2">
                    <div className="flex justify-between">
                      <span className="max-w-[220px] truncate">
                        <strong>{item?.selection}</strong>
                      </span>
                      <strong>{item?.odds}</strong>
                    </div>
                    <div>Resultado del Partido</div>
                    <div className="grid grid-cols-[1fr_auto]">
                      <span>{item?.event_name}</span>
                      <span>{item?.event_date}</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-4 grid gap-2 grid-rows-[1fr_1fr]">
                <div className="flex justify-between gap-4">
                  <span>Apuesta</span>
                  <strong>s/100 00</strong>
                </div>
                <div className="flex justify-between gap-4">
                  <span>
                    <strong>
                      {2 === 2 ? "Ganancia" : "Ganancias Potenciales"}
                    </strong>
                  </span>
                  <strong className="text-[15px]">s/ 100 00</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="h-auto p-4 text-[13px] flex flex-col gap-4">
          <div className="grid grid-cols-3 gap-2">
            <button
              className="p-2 bg-red-500 text-white text-[12px] rounded-[11px]"
              onClick={() => setOpenSocial((state) => !state)}
            >
              Compartir enlace
            </button>
            <button
              className="p-2 bg-red-500 text-white text-[12px] rounded-[11px]"
              onClick={() => onDownload(refImgContainer.current, true)}
            >
              Descargar
            </button>
            <button
              className="p-2 bg-red-500 text-white text-[12px] rounded-[11px]"
              onClick={() => onDownload(refImgContainer.current, false)}
            >
              Copiar Imagen
            </button>
          </div>
          <div
            className={classNames("grid grid-cols-4 gap-2 hidden", {
              grid: openSocial,
            })}
          >
            <button className="p-2 h-[50px]" onClick={() => handleMessage("1")}>
              <MdFacebook size={20} />
            </button>
            <button className="p-2 h-[50px]" onClick={() => handleMessage("2")}>
              <MdWhatsapp size={20} />
            </button>
            <button className="p-2 h-[50px]" onClick={() => handleMessage("3")}>
              <BsTwitterX size={20} />
            </button>
            <button className="p-2 h-[50px]" onClick={() => handleMessage("4")}>
              Copiar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Component;
