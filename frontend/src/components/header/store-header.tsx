"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Container } from "@/components/ui/container";
import { HeaderIcon } from "./header-icon";
import "./store-header.css";

const links = [
  { label: "Shop All", href: "/shop" },
  { label: "Nike", href: "/brands/nike" },
  { label: "Adidas", href: "/brands/adidas" },
  { label: "Puma", href: "/brands/puma" },
  { label: "About", href: "/about" },
];

export function StoreHeader() {
  const pathname = usePathname();
  const dialog = useRef<HTMLDialogElement>(null);
  const search = useRef<HTMLInputElement>(null);
  const opener = useRef<HTMLButtonElement | null>(null);
  const brand = useRef<HTMLAnchorElement>(null);
  const [panel, setPanel] = useState<"menu" | "search" | null>(null);

  useEffect(() => {
    if (!panel) return;
    const element = dialog.current;
    const previousOverflow = document.body.style.overflow;
    element?.showModal();
    document.body.style.overflow = "hidden";
    if (panel === "search") search.current?.focus();
    return () => {
      element?.close();
      document.body.style.overflow = previousOverflow;
    };
  }, [panel]);

  function close() {
    dialog.current?.close();
    setPanel(null);
    const target = opener.current;
    if (target?.getClientRects().length) target.focus();
    else brand.current?.focus();
  }

  function navigation(mobile = false) {
    return <nav aria-label={mobile ? "Mobile navigation" : "Main navigation"} className={mobile ? "store-header-mobileLinks" : "store-header-desktopLinks"}>
      {links.map(({ label, href }) => <Link key={href} href={href} prefetch={false} aria-current={pathname === href || pathname.startsWith(`${href}/`) ? "page" : undefined} onClick={mobile ? close : undefined}>{label}</Link>)}
    </nav>;
  }

  return <header className={"store-header-header"}>
    <a href="#store-content" className={"store-header-skip"}>Skip to content</a>
    <div className={"store-header-announcement"}>Original football boots. <span>Built for your next game.</span></div>
    <Container className={"store-header-row"}>
      <Link ref={brand} href="/" className={"store-header-brand"} aria-label="Football Kit home">FOOTBALL KIT<span aria-hidden="true">.</span></Link>
      {navigation()}
      <div className={"store-header-controls"}>
        <button type="button" className={"store-header-iconButton"} aria-label="Open search" aria-haspopup="dialog" aria-expanded={panel === "search"} aria-controls="header-panel" onClick={event => { opener.current = event.currentTarget; setPanel("search"); }}><HeaderIcon name="search" /></button>
        <button type="button" className={"store-header-iconButton"} disabled aria-label="Shopping bag, 0 items. Cart not available yet." title="Cart not available yet"><HeaderIcon name="bag" /><span className={"store-header-count"}>0</span></button>
        <button type="button" className={`${"store-header-iconButton"} ${"store-header-menuTrigger"}`} aria-label="Open menu" aria-haspopup="dialog" aria-expanded={panel === "menu"} aria-controls="header-panel" onClick={event => { opener.current = event.currentTarget; setPanel("menu"); }}><HeaderIcon name="menu" /></button>
      </div>
    </Container>
    <dialog ref={dialog} id="header-panel" aria-labelledby="header-panel-title" className={`${"store-header-panel"} ${panel === "search" ? "store-header-searchPanel" : ""}`} onKeyDown={event => { if (event.key !== "Tab") return; const controls = Array.from(event.currentTarget.querySelectorAll<HTMLElement>("a[href], button:not(:disabled), input:not(:disabled)")); const first = controls[0]; const last = controls[controls.length - 1]; if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); } else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); } }} onCancel={event => { event.preventDefault(); close(); }} onClick={event => { if (event.target === event.currentTarget) { const bounds = event.currentTarget.getBoundingClientRect(); if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) close(); } }}>
      <div className={"store-header-panelTop"}><h2 id="header-panel-title">{panel === "search" ? "Find your next pair." : "Explore Football Kit."}</h2><button type="button" className={"store-header-iconButton"} aria-label={panel === "search" ? "Close search" : "Close menu"} onClick={close}><HeaderIcon name="close" /></button></div>
      {panel === "menu" ? <>{navigation(true)}<p className={"store-header-note"}>Store pages are coming soon. This is a navigation preview.</p></> : <div className={"store-header-searchContent"}>
        <label htmlFor="boot-search">Search football boots</label>
        <div className={"store-header-inputWrap"}><HeaderIcon name="search" /><input ref={search} id="boot-search" type="search" onKeyDown={event => { if (event.key === "Escape") { event.preventDefault(); event.stopPropagation(); close(); } }} placeholder="Brand, model or size" aria-describedby="search-note" autoComplete="off" /></div>
        <p id="search-note" className={"store-header-note"}>Search preview only. Catalog search is not connected yet; no results will be shown.</p>
      </div>}
    </dialog>
  </header>;
}
