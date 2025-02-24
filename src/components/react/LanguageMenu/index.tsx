import GlobalIcon from '@assets/global.svg';
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import type { ContentType } from 'src/types/translations';

type LanguageMenuProps = {
  content: ContentType;
};

const LanguageMenu: React.FC<LanguageMenuProps> = ({ content }) => {
  return (
    <div className="w-full">
      <div className="m-0 ml-auto size-[20px]">
        <Menu>
          <MenuButton>
            <img
              src={GlobalIcon.src}
              alt=""
              className="size-[20px] cursor-pointer"
            />
          </MenuButton>
          <MenuItems
            anchor="bottom end"
            transition
            className="mt-1 rounded-[4px] bg-white transition duration-100 ease-out data-[closed]:scale-95 data-[closed]:opacity-0"
          >
            <MenuItem>
              <a
                className="data-[focus]:bg-secondary block w-full p-1.5 text-left"
                href="/en"
              >
                {content.languageMenu.english}
              </a>
            </MenuItem>
            <MenuItem>
              <a
                className="data-[focus]:bg-secondary block w-full p-1.5 text-left"
                href="/ja"
              >
                {content.languageMenu.japanese}
              </a>
            </MenuItem>
            <MenuItem>
              <a
                className="data-[focus]:bg-secondary block w-full p-1.5 text-left"
                href="/moai"
              >
                {content.languageMenu.moai}
              </a>
            </MenuItem>
          </MenuItems>
        </Menu>
      </div>
    </div>
  );
};

export default LanguageMenu;
