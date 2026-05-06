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
                        .fi-topbar, .fi-sidebar {
                            background: rgba(15, 17, 26, 0.8) !important;
                            backdrop-filter: blur(15px);
                            border-color: rgba(181, 134, 63, 0.1) !important;
                        }
                        .fi-logo img {
                            filter: drop-shadow(0 0 10px rgba(181, 134, 63, 0.6));
                        }
                        /* Inputs and Buttons */
                        button { border-radius: 9999px !important; }
                        input, select, textarea { border-radius: 0.75rem !important; }
                        input:focus, select:focus, textarea:focus {
                            box-shadow: 0 0 0 1px #B5863F, 0 0 15px rgba(181,134,63,0.2) !important;
                            border-color: #B5863F !important;
                        }
                    </style>
                ')
            )
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
