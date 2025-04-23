<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class PassLengthMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        if (!$request->password) {
            return response()->json([
                'status' => 'invalid',
                'message' => 'Missing password'
            ], 400);
        }

        if (strlen($request->password) < 5 || strlen($request->password) > 10) {
            return response()->json([
                'status' => 'invalid',
                'message' => 'Password must be between 5 and 10 characters'
            ], 400);
        }

        return $next($request);
    }
}
