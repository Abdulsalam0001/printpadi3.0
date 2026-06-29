import { ArrowCircleRight2 } from "iconsax-reactjs";
import { Link } from "react-router-dom";
import { IonImg } from "@ionic/react";
import { ReactNode } from "react";

export const ContainerWithGradient = ({
  children,
  title,
  description,
  linkTo,
}: {
  children: ReactNode;
  title: string;
  description: string;
  linkTo: string;
}) => {
  return (
    <div className="section-gradient h-[30vh] w-full relative">
      <div className="p-4">
        <div className="flex items-start justify-between">
          <div className="capitalize text-white">
            <h3 className="text-[15px] font-medium">{title}</h3>
            <p className="font-sans text-[8px]">{description}</p>
          </div>

          <Link to={linkTo}>
            <ArrowCircleRight2 color="#ffffff" />
          </Link>
        </div>

        {children}
      </div>

      <div className="absolute top-0 right-0">
        <IonImg src="/faint-logo.svg" alt="" />
      </div>

      <div className="absolute bottom-0 left-0">
        <IonImg src="/faint-logo-2.svg" alt="" />
      </div>
    </div>
  );
};