"use client";

import { useEffect, useState, useCallback, useRef, useMemo } from "react";
import { createPortal } from "react-dom";
import { useTour, TourPage, TOUR_PAGES } from "@/contexts/TourContext";
import { getTourSteps, TourStep } from "./tourSteps";

/* ─── Smart position calculator ─── */
function findBestPosition(
    targetRect: DOMRect,
    tooltipW: number,
    tooltipH: number,
    preferred: "top" | "bottom" | "left" | "right"
): { top: number; left: number; arrow: "top" | "bottom" | "left" | "right" } {
    const GAP = 14;
    const EDGE = 12;
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    // Available space in each direction
    const spaceAbove = targetRect.top;
    const spaceBelow = vh - targetRect.bottom;
    const spaceLeft = targetRect.left;
    const spaceRight = vw - targetRect.right;

    // Try directions in order of preference
    const order: Array<"top" | "bottom" | "left" | "right"> = [preferred];
    if (preferred === "bottom") order.push("top", "right", "left");
    else if (preferred === "top") order.push("bottom", "right", "left");
    else if (preferred === "right") order.push("left", "bottom", "top");
    else order.push("right", "bottom", "top");

    for (const dir of order) {
        let top = 0, left = 0;
        let fits = false;

        switch (dir) {
            case "bottom":
                if (spaceBelow >= tooltipH + GAP) {
                    top = targetRect.bottom + GAP;
                    left = targetRect.left + targetRect.width / 2 - tooltipW / 2;
                    fits = true;
                }
                break;
            case "top":
                if (spaceAbove >= tooltipH + GAP) {
                    top = targetRect.top - tooltipH - GAP;
                    left = targetRect.left + targetRect.width / 2 - tooltipW / 2;
                    fits = true;
                }
                break;
            case "right":
                if (spaceRight >= tooltipW + GAP) {
                    top = targetRect.top + targetRect.height / 2 - tooltipH / 2;
                    left = targetRect.right + GAP;
                    fits = true;
                }
                break;
            case "left":
                if (spaceLeft >= tooltipW + GAP) {
                    top = targetRect.top + targetRect.height / 2 - tooltipH / 2;
                    left = targetRect.left - tooltipW - GAP;
                    fits = true;
                }
                break;
        }

        if (fits) {
            // Clamp to viewport
            top = Math.max(EDGE, Math.min(top, vh - tooltipH - EDGE));
            left = Math.max(EDGE, Math.min(left, vw - tooltipW - EDGE));
            // arrow points toward the target
            const arrow = dir === "bottom" ? "top" : dir === "top" ? "bottom" : dir === "right" ? "left" : "right";
            return { top, left, arrow };
        }
    }

    // Fallback: force bottom
    const top = Math.max(EDGE, Math.min(targetRect.bottom + GAP, vh - tooltipH - EDGE));
    const left = Math.max(EDGE, Math.min(targetRect.left + targetRect.width / 2 - tooltipW / 2, vw - tooltipW - EDGE));
    return { top, left, arrow: "top" };
}

/* ─── Component ─── */
export function TourOverlay() {
    const { isTourActive, currentTourPage, tourRole, endTour, advanceToPage, projectId } = useTour();
    const [stepIndex, setStepIndex] = useState(0);
    const [targetRect, setTargetRect] = useState<DOMRect | null>(null);
    const [tooltipPos, setTooltipPos] = useState<{ top: number; left: number; arrow?: string }>({ top: 0, left: 0 });
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [mounted, setMounted] = useState(false);
    const tooltipRef = useRef<HTMLDivElement>(null);
    const resizeObserverRef = useRef<ResizeObserver | null>(null);
    const retryCountRef = useRef(0);

    const steps = getTourSteps(tourRole);
    const currentPageSteps = steps.filter(s => s.page === currentTourPage);
    const currentPageStartIndex = steps.findIndex(s => s.page === currentTourPage);
    const globalIndex = currentPageStartIndex + stepIndex;
    const currentStep = currentPageSteps[stepIndex];
    const totalSteps = steps.length;
    const progress = totalSteps > 0 ? ((globalIndex + 1) / totalSteps) * 100 : 0;

    // Page groups for the step indicator
    const pageGroups = useMemo(() => {
        const groups: { page: TourPage; count: number; startIdx: number }[] = [];
        let idx = 0;
        let lastPage: TourPage | null = null;
        for (const step of steps) {
            if (step.page !== lastPage) {
                groups.push({ page: step.page, count: 1, startIdx: idx });
                lastPage = step.page;
            } else {
                groups[groups.length - 1].count++;
            }
            idx++;
        }
        return groups;
    }, [steps]);

    useEffect(() => { setMounted(true); return () => setMounted(false); }, []);
    useEffect(() => { setStepIndex(0); }, [currentTourPage]);

    // ─── Find target element ───
    const updateTargetPosition = useCallback(() => {
        if (!currentStep?.target) { setTargetRect(null); return; }

        const selectors = currentStep.target.split(',').map(s => s.trim());
        let el: HTMLElement | null = null;
        for (const sel of selectors) {
            try { el = document.querySelector(sel) as HTMLElement; if (el) break; } catch { /* ignore */ }
        }

        if (el) {
            retryCountRef.current = 0;
            const rect = el.getBoundingClientRect();
            setTargetRect(rect);
            const isInView = rect.top >= 0 && rect.bottom <= window.innerHeight;
            if (!isInView) {
                el.scrollIntoView({ behavior: "smooth", block: "center" });
                setTimeout(() => { setTargetRect(el!.getBoundingClientRect()); }, 400);
            }
        } else if (retryCountRef.current < 8) {
            retryCountRef.current++;
            setTimeout(updateTargetPosition, 300);
        } else {
            setTargetRect(null);
        }
    }, [currentStep]);

    // ─── Update on step/page change ───
    useEffect(() => {
        if (!isTourActive || !currentStep) return;
        retryCountRef.current = 0;
        const timer = setTimeout(updateTargetPosition, 500);
        window.addEventListener("resize", updateTargetPosition);
        window.addEventListener("scroll", updateTargetPosition, true);

        if (currentStep.target) {
            resizeObserverRef.current = new ResizeObserver(() => updateTargetPosition());
            const el = document.querySelector(currentStep.target);
            if (el) resizeObserverRef.current.observe(el);
        }

        return () => {
            clearTimeout(timer);
            window.removeEventListener("resize", updateTargetPosition);
            window.removeEventListener("scroll", updateTargetPosition, true);
            resizeObserverRef.current?.disconnect();
        };
    }, [isTourActive, currentStep, updateTargetPosition, currentTourPage, stepIndex]);

    // ─── Smart tooltip positioning ───
    useEffect(() => {
        if (!isTourActive || !currentStep) return;

        const calculatePos = () => {
            const tooltip = tooltipRef.current;
            if (!tooltip) return;
            const tW = tooltip.offsetWidth;
            const tH = tooltip.offsetHeight;
            const vw = window.innerWidth;
            const vh = window.innerHeight;

            if (!currentStep.target || !targetRect || currentStep.position === "center") {
                setTooltipPos({ top: Math.max(12, (vh - tH) / 2), left: Math.max(12, (vw - tW) / 2) });
                return;
            }

            const preferred = currentStep.position || "bottom";
            const result = findBestPosition(targetRect, tW, tH, preferred);
            setTooltipPos({ top: result.top, left: result.left, arrow: result.arrow });
        };

        const raf = requestAnimationFrame(calculatePos);
        return () => cancelAnimationFrame(raf);
    }, [isTourActive, currentStep, targetRect]);

    // ─── Interactive nav click handler ───
    useEffect(() => {
        if (!isTourActive || !currentStep?.interactive || !currentStep.showClickIndicator) return;

        const handleNavClick = () => { setTimeout(() => { handleNext(); }, 100); };

        const selectors = currentStep.target ? currentStep.target.split(',').map(s => s.trim()) : [];
        let el: HTMLElement | null = null;
        for (const sel of selectors) {
            try { el = document.querySelector(sel) as HTMLElement; if (el) break; } catch { /* */ }
        }
        if (el) {
            el.addEventListener("click", handleNavClick, { once: true });
            return () => el!.removeEventListener("click", handleNavClick);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isTourActive, currentStep, stepIndex, currentTourPage]);

    const handleNext = useCallback(() => {
        if (!currentStep) return;
        const nextStepIdxInPage = stepIndex + 1;

        if (nextStepIdxInPage < currentPageSteps.length) {
            setIsTransitioning(true);
            setTimeout(() => { setStepIndex(nextStepIdxInPage); setIsTransitioning(false); }, 180);
        } else {
            const nextGlobalStep = steps[globalIndex + 1];
            if (nextGlobalStep) {
                setIsTransitioning(true);
                setTimeout(() => { advanceToPage(nextGlobalStep.page); setIsTransitioning(false); }, 180);
            } else {
                endTour();
            }
        }
    }, [currentStep, stepIndex, currentPageSteps, globalIndex, steps, advanceToPage, endTour]);

    const handlePrev = useCallback(() => {
        if (stepIndex > 0) {
            setIsTransitioning(true);
            setTimeout(() => { setStepIndex(stepIndex - 1); setIsTransitioning(false); }, 180);
        } else {
            const currentPageIdx = TOUR_PAGES.indexOf(currentTourPage!);
            if (currentPageIdx > 0) {
                const prevPageName = TOUR_PAGES[currentPageIdx - 1];
                if (prevPageName !== "complete") {
                    setIsTransitioning(true);
                    setTimeout(() => { advanceToPage(prevPageName); }, 180);
                }
            }
        }
    }, [stepIndex, currentTourPage, advanceToPage]);

    if (!mounted || !isTourActive || !currentStep) return null;

    const isFirstStep = globalIndex === 0;
    const isLastStep = globalIndex === totalSteps - 1;
    const hasTarget = !!currentStep.target && !!targetRect;
    const isInteractiveNav = currentStep.interactive && currentStep.showClickIndicator;

    // Spotlight clip path — rounded corners via inset
    const spotlightPad = 10;
    const spotlightClipPath = hasTarget
        ? `polygon(
            0% 0%, 100% 0%, 100% 100%, 0% 100%, 0% 0%,
            ${targetRect!.left - spotlightPad}px ${targetRect!.top - spotlightPad}px,
            ${targetRect!.left - spotlightPad}px ${targetRect!.bottom + spotlightPad}px,
            ${targetRect!.right + spotlightPad}px ${targetRect!.bottom + spotlightPad}px,
            ${targetRect!.right + spotlightPad}px ${targetRect!.top - spotlightPad}px,
            ${targetRect!.left - spotlightPad}px ${targetRect!.top - spotlightPad}px
          )`
        : undefined;

    // Arrow position for tooltip
    const arrowDir = (tooltipPos as any).arrow;

    // Current page label
    const PAGE_LABELS: Record<string, string> = {
        dashboard: "대시보드",
        features: "기능 현황",
        feed: "새소식",
        timeline: "프로젝트 일정",
        reports: "AI 리포트",
        documents: "산출물",
        billing: "결제",
        settings: "설정",
    };

    return createPortal(
        <div className="commitly-tour-root" data-tour-active="true">
            {/* ─── Top progress bar ─── */}
            <div className="tour-progress-bar">
                <div className="tour-progress-fill" style={{ width: `${progress}%` }} />
            </div>

            {/* ─── Top bar: step counter + page label + skip ─── */}
            <div className="tour-topbar">
                <div className="tour-topbar-left">
                    <span className="tour-step-counter">{globalIndex + 1} / {totalSteps}</span>
                    <span className="tour-page-label">{PAGE_LABELS[currentStep.page] || currentStep.page}</span>
                </div>
                <button className="tour-skip-btn" onClick={() => endTour()}>건너뛰기</button>
            </div>

            {/* ─── Overlay ─── */}
            <div
                className={`tour-overlay ${hasTarget ? "tour-overlay--spotlight" : ""}`}
                style={hasTarget ? { clipPath: spotlightClipPath } : undefined}
            />

            {/* ─── Spotlight ring ─── */}
            {hasTarget && (
                <div
                    className="tour-spotlight-ring"
                    style={{
                        top: targetRect!.top - spotlightPad,
                        left: targetRect!.left - spotlightPad,
                        width: targetRect!.width + spotlightPad * 2,
                        height: targetRect!.height + spotlightPad * 2,
                    }}
                />
            )}

            {/* ─── Click indicator ─── */}
            {hasTarget && isInteractiveNav && (
                <div
                    className="tour-click-indicator"
                    style={{
                        top: targetRect!.top + targetRect!.height / 2,
                        left: targetRect!.left + targetRect!.width / 2,
                    }}
                />
            )}

            {/* ─── Tooltip ─── */}
            <div
                ref={tooltipRef}
                className={`tour-tooltip ${isTransitioning ? "tour-tooltip--exit" : "tour-tooltip--enter"} ${!hasTarget ? "tour-tooltip--centered" : ""}`}
                style={{ top: tooltipPos.top, left: tooltipPos.left }}
            >
                {/* Arrow */}
                {hasTarget && arrowDir && <div className={`tour-arrow tour-arrow--${arrowDir}`} />}

                {/* Header with page chip */}
                <div className="tour-tooltip-header">
                    <div className="tour-tooltip-header-left">
                        <h3 className="tour-tooltip-title">{currentStep.title}</h3>
                    </div>
                    <button className="tour-tooltip-close" onClick={() => endTour()} aria-label="닫기">
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M11 3L3 11M3 3l8 8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>
                    </button>
                </div>

                {/* Content */}
                <div className="tour-tooltip-body" dangerouslySetInnerHTML={{ __html: currentStep.content }} />

                {/* Action hint */}
                {currentStep.actionHint && (
                    <div className="tour-action-hint">{currentStep.actionHint}</div>
                )}

                {/* Page segment indicator */}
                <div className="tour-segments">
                    {pageGroups.map((group, gi) => (
                        <div key={gi} className="tour-segment-group">
                            {Array.from({ length: group.count }).map((_, si) => {
                                const idx = group.startIdx + si;
                                return (
                                    <span
                                        key={si}
                                        className={`tour-segment-dot ${idx === globalIndex ? "tour-segment-dot--active" : ""} ${idx < globalIndex ? "tour-segment-dot--done" : ""}`}
                                    />
                                );
                            })}
                        </div>
                    ))}
                </div>

                {/* Footer */}
                <div className="tour-tooltip-footer">
                    <button
                        className={`tour-btn tour-btn--prev ${isFirstStep ? "tour-btn--disabled" : ""}`}
                        onClick={handlePrev}
                        disabled={isFirstStep}
                    >
                        ← 이전
                    </button>

                    {isInteractiveNav ? (
                        <div className="tour-nav-hint">
                            <span className="tour-nav-hint-dot" />
                            해당 메뉴를 클릭하세요
                        </div>
                    ) : (
                        <button className="tour-btn tour-btn--next" onClick={isLastStep ? () => endTour() : handleNext}>
                            {isLastStep ? "완료하기 ✓" : "다음 →"}
                        </button>
                    )}
                </div>
            </div>
        </div>,
        document.body
    );
}
