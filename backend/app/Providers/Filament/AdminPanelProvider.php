<?php

namespace App\Providers\Filament;

use Filament\Http\Middleware\Authenticate;
use Filament\Http\Middleware\AuthenticateSession;
use Filament\Http\Middleware\DisableBladeIconComponents;
use Filament\Http\Middleware\DispatchServingFilamentEvent;
use Filament\Pages\Dashboard;
use Filament\Panel;
use Filament\PanelProvider;
use Filament\Support\Colors\Color;
use Filament\Widgets\AccountWidget;
use Filament\Widgets\FilamentInfoWidget;
use Illuminate\Cookie\Middleware\AddQueuedCookiesToResponse;
use Illuminate\Cookie\Middleware\EncryptCookies;
use Illuminate\Foundation\Http\Middleware\PreventRequestForgery;
use Illuminate\Routing\Middleware\SubstituteBindings;
use Illuminate\Session\Middleware\StartSession;
use Illuminate\View\Middleware\ShareErrorsFromSession;

class AdminPanelProvider extends PanelProvider
{
    public function panel(Panel $panel): Panel
    {
        return $panel
            ->default()
            ->id('admin')
            ->path('admin')
            ->login()
            ->sidebarCollapsibleOnDesktop()
            ->defaultThemeMode(\Filament\Enums\ThemeMode::Dark)
            ->brandName('Nine 1 Luxury')
            ->brandLogo(fn () => asset('logo-main.png'))
            ->brandLogoHeight('7rem')
            ->favicon(fn () => asset('favicon.svg'))
            ->colors([
                'primary' => '#B5863F',
                'gray' => '#0F111A', // Frontend dark charcoal
            ])
            ->font('Cairo')
            ->renderHook(
                \Filament\View\PanelsRenderHook::HEAD_END,
                fn (): string => \Illuminate\Support\Facades\Blade::render('
                    <style>
                        /* Scrollbar Styling */
                        ::-webkit-scrollbar {
                            width: 4px;
                            height: 4px;
                        }
                        ::-webkit-scrollbar-track {
                            background: transparent;
                        }
                        ::-webkit-scrollbar-thumb {
                            background: rgba(181, 134, 63, 0.3);
                            border-radius: 4px;
                        }
                        ::-webkit-scrollbar-thumb:hover {
                            background: rgba(181, 134, 63, 0.6);
                        }
                        /* Hide sidebar scrollbar for cleaner look */
                        .fi-sidebar-nav::-webkit-scrollbar {
                            display: none;
                        }
                        .fi-sidebar-nav {
                            -ms-overflow-style: none;  /* IE and Edge */
                            scrollbar-width: none;  /* Firefox */
                        }

                        /* Global & Typography Font Weight */
                        body, .fi-main, .fi-sidebar, input, button, select, textarea,
                        .fi-sidebar-item-label, .fi-sidebar-group-label, .fi-header-heading,
                        .fi-topbar .fi-dropdown-list-item-label {
                            font-weight: 800 !important;
                        }
                        /* Login Page Luxury Styling */
                        .fi-simple-main {
                            background: radial-gradient(circle at center, rgba(181,134,63,0.15) 0%, #0F111A 100%) !important;
                        }
                        .fi-simple-layout {
                            background: url("'.asset('logo-main.png').'") center/cover no-repeat;
                            background-blend-mode: overlay;
                            background-color: rgba(15, 17, 26, 0.95);
                        }
                        .fi-simple-page > section {
                            background: rgba(15, 17, 26, 0.6) !important;
                            backdrop-filter: blur(20px);
                            border: 1px solid rgba(181, 134, 63, 0.2);
                            box-shadow: 0 0 40px rgba(181,134,63,0.1);
                            border-radius: 1.5rem !important;
                        }
                        /* Dashboard Luxury Styling */
                        .fi-topbar {
                            background: rgba(15, 17, 26, 0.8) !important;
                            backdrop-filter: blur(20px);
                            border-bottom: 1px solid rgba(181, 134, 63, 0.15) !important;
                        }
                        
                        .fi-sidebar {
                            background: transparent !important;
                            border-inline-end: none !important;
                        }

                        .fi-main {
                            background: radial-gradient(circle at 10% 20%, rgba(181,134,63,0.05) 0%, #0F111A 80%) !important;
                        }

                        .fi-logo img {
                            filter: drop-shadow(0 0 15px rgba(181, 134, 63, 0.5));
                        }

                        /* Glassmorphism for Containers */
                        .fi-section, .fi-ta-content, .fi-modal-window {
                            background: rgba(20, 23, 33, 0.7) !important;
                            backdrop-filter: blur(12px) !important;
                            border: 1px solid rgba(181, 134, 63, 0.1) !important;
                            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3) !important;
                            border-radius: 1.25rem !important;
                        }

                        /* Table Enhancements */
                        .fi-ta-header-cell {
                            background: rgba(181, 134, 63, 0.05) !important;
                            color: #B5863F !important;
                            text-transform: uppercase;
                            letter-spacing: 0.05em;
                        }

                        .fi-ta-record:hover {
                            background: rgba(181, 134, 63, 0.03) !important;
                        }

                        /* Luxury Buttons */
                        .fi-btn-color-primary {
                            background: linear-gradient(135deg, #B5863F 0%, #d4a76a 100%) !important;
                            color: #0F111A !important;
                            box-shadow: 0 4px 15px rgba(181, 134, 63, 0.3) !important;
                            transition: all 0.3s ease !important;
                        }

                        .fi-btn-color-primary:hover {
                            transform: translateY(-2px);
                            box-shadow: 0 6px 20px rgba(181, 134, 63, 0.4) !important;
                        }

                        /* Stats Widgets */
                        .fi-wi-stats-overview-stat {
                            background: rgba(255, 255, 255, 0.03) !important;
                            border: 1px solid rgba(181, 134, 63, 0.1) !important;
                        }

                        /* Inputs and Buttons */
                        button { border-radius: 9999px !important; }
                        input, select, textarea { 
                            border-radius: 0.75rem !important; 
                            background: rgba(0,0,0,0.2) !important;
                        }
                        input:focus, select:focus, textarea:focus {
                            box-shadow: 0 0 0 1px #B5863F, 0 0 15px rgba(181,134,63,0.2) !important;
                            border-color: #B5863F !important;
                        }
                    </style>
                ')
            )
            ->plugins([
                \BezhanSalleh\FilamentShield\FilamentShieldPlugin::make(),
            ])
            ->discoverResources(in: app_path('Filament/Resources'), for: 'App\Filament\Resources')
            ->discoverPages(in: app_path('Filament/Pages'), for: 'App\Filament\Pages')
            ->pages([
                Dashboard::class,
            ])
            ->discoverWidgets(in: app_path('Filament/Widgets'), for: 'App\Filament\Widgets')
            ->widgets([
                AccountWidget::class,
            ])
            ->middleware([
                EncryptCookies::class,
                AddQueuedCookiesToResponse::class,
                StartSession::class,
                AuthenticateSession::class,
                ShareErrorsFromSession::class,
                PreventRequestForgery::class,
                SubstituteBindings::class,
                DisableBladeIconComponents::class,
                DispatchServingFilamentEvent::class,
            ])
            ->authMiddleware([
                Authenticate::class,
            ]);
    }
}
